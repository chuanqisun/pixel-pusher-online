// This is a counter widget with buttons to increment and decrement the number.
import type { HistoryMessage, MessageToMain, MessageToUI } from "types";

const { useSyncedState, AutoLayout, Rectangle, Text, useWidgetId, useEffect, waitForTask } = figma.widget;

const HISTORY_MESSAGE_LIMIT = 128;

let isUiOpen = false;

function Widget() {
  const widgetId = useWidgetId();

  const [imageUrl, setImageUrl] = useSyncedState<string | null>("imageUrl", null);
  const [transform, setTransform] = useSyncedState<Transform | null>("transform", null);

  const [user, setUser] = useSyncedState<User | null>("user", null);
  const [nickname, setNickname] = useSyncedState("nickname", "Loading...");

  // Auto-open UI on creation
  useEffect(() => {
    if (!isUiOpen)
      waitForTask(
        new Promise((resolve) => {
          figma.showUI(`<script>window.location.href = "${process.env.WEB_URL}"</script>`, { height: 600, width: 400 });
          isUiOpen = true;
          figma.currentPage.selection = [];
        })
      );
  });

  // Assign new widget to current user
  useEffect(() => {
    const widgetNode = figma.getNodeById(widgetId) as WidgetNode;
    if (user) return;

    // find and clean other instances of the same avatar
    const otherInstances = figma.currentPage
      .findWidgetNodesByWidgetId(widgetNode.widgetId)
      .filter((node) => node.getPluginData("userId") === figma.currentUser.id);

    waitForTask(
      (async () => {
        setUser(figma.currentUser);

        widgetNode.setPluginData("userId", figma.currentUser.id);
        sendToUI({ defaultNickname: figma.currentUser.name });

        console.log(`Cleanup: ${otherInstances.length} other instances`);
        otherInstances.forEach((instance) => instance.remove());
      })()
    );
  });

  // Handle user input
  useEffect(() => {
    if (!user) return;
    if (user.id !== figma.currentUser.id) return;

    figma.ui.onmessage = async (message: MessageToMain) => {
      const widgetNode = figma.getNodeById(widgetId) as WidgetNode;

      if (message.findMyself) {
        alignViewport(getNodeCenter(widgetNode));
        widgetNode.parent.appendChild(widgetNode); // bring to front
        figma.viewport.zoom = 2;
      }

      if (typeof message.nickname === "string") {
        setNickname(message.nickname.length ? message.nickname : "???");
      }

      if (message.transform) {
        setTransform(message.transform);
      }

      if (message.newMessage) {
        const historyMessage: HistoryMessage = {
          // sessionId (unique among active users) | timestamp (100 days unique) | pseudorandom (6 digit)
          msgId: `${figma.currentUser.sessionId}-${Date.now().toString().slice(-10)}-${Math.random().toFixed(6).slice(2)}`,
          fromId: user.id,
          fromNickname: nickname,
          fromColor: user.color,
          timestamp: Date.now(),
          content: message.newMessage.content,
        };
        console.log(historyMessage);

        const existingHistoryMessages = getHistoryMessages();
        const allMessages = [...existingHistoryMessages, historyMessage].slice(-HISTORY_MESSAGE_LIMIT);

        figma.currentPage.setPluginData("historyMessages", JSON.stringify(allMessages));

        figma.currentPage.setPluginData("syncedMessageId", historyMessage.msgId);
        widgetNode.setPluginData("syncedMessageId", historyMessage.msgId);

        sendToUI({ historyMessages: allMessages });
      }

      if (message.getHistoryMessages) {
        const latestId = figma.currentPage.getPluginData("syncedMessageId");
        if (latestId !== message.getHistoryMessages.lastId) {
          console.log(`[chat] new message available for UI`);
          const historyMessages = getHistoryMessages();
          sendToUI({ historyMessages });
        }
      }

      if (message.move) {
        switch (message.move) {
          case "N":
            widgetNode.y -= 8;
            alignViewport({ y: getNodeCenter(widgetNode).y });
            break;
          case "E":
            widgetNode.x += 8;
            alignViewport({ x: getNodeCenter(widgetNode).x });
            break;
          case "S":
            widgetNode.y += 8;
            alignViewport({ y: getNodeCenter(widgetNode).y });
            break;
          case "W":
            widgetNode.x -= 8;
            alignViewport({ x: getNodeCenter(widgetNode).x });
            break;
        }
      }

      if (message.avatarUrl) {
        setImageUrl(message.avatarUrl);
      }
    };
  });

  const handleAvatarClick = async () => {
    const widgetNode = figma.getNodeById(widgetId) as WidgetNode;
    console.log(`Current widget`, widgetNode);
    console.log(`Current data`, user);

    if (user.id !== figma.currentUser.id) {
      figma.notify("Sorry, this avatar is created by someone else.");
      return;
    }

    figma.currentPage.selection = [];

    await new Promise((resolve) => {
      figma.showUI(`<script>window.location.href = "${process.env.WEB_URL}"</script>`, { height: 600, width: 400 });
    });
  };

  return (
    <AutoLayout tooltip={user?.name} width={32} height={32} overflow="visible">
      <AutoLayout
        fill={user?.color}
        padding={{ vertical: 2, horizontal: 4 }}
        cornerRadius={4}
        positioning="absolute"
        x={{ type: "center", offset: 0 }}
        y={{ type: "top", offset: -24 }}
      >
        <Text fill="#fff" opacity={1} fontSize={12} horizontalAlignText="center">
          {nickname}
        </Text>
      </AutoLayout>
      {transform && imageUrl && (
        <Rectangle
          onClick={handleAvatarClick}
          width={32}
          height={32}
          fill={{
            type: "image",
            scaleMode: "crop",
            imageTransform: transform,
            src: imageUrl,
          }}
        />
      )}
    </AutoLayout>
  );
}

function alignViewport({ x, y }: { x?: number; y?: number }) {
  figma.viewport.center = {
    x: x ?? figma.viewport.center.x,
    y: y ?? figma.viewport.center.y,
  };
}

function getNodeCenter(node: WidgetNode) {
  return {
    x: node.x + (node.width >> 1),
    y: node.y + (node.height >> 1),
  };
}

function sendToUI(message: MessageToUI) {
  figma.ui.postMessage(message);
}

function getHistoryMessages(): HistoryMessage[] {
  const storedMessageString = figma.currentPage.getPluginData("historyMessages");
  const storedMessages: HistoryMessage[] = storedMessageString.length ? JSON.parse(storedMessageString) : [];
  return storedMessages;
}

figma.widget.register(Widget);
