// This is a counter widget with buttons to increment and decrement the number.
import type { HistoryMessage, MessageToMain, MessageToUI, TilePosition } from "types";

const { useSyncedState, AutoLayout, Rectangle, Text, useWidgetId, useEffect, waitForTask } = figma.widget;

const HISTORY_MESSAGE_LIMIT = 128;
const AVATAR_SIZE = 32;

let isUiOpen = false;

interface MapMetadata {
  key: string;
  tileSize: number;
  spawnTiles: TilePosition[];
}

function Widget() {
  const widgetId = useWidgetId();

  const [imageUrl, setImageUrl] = useSyncedState<string | null>("imageUrl", null);
  const [transform, setTransform] = useSyncedState<Transform | null>("transform", null);

  const [user, setUser] = useSyncedState<User | null>("user", null);
  const [nickname, setNickname] = useSyncedState("nickname", "Loading...");

  // Auto-open UI on start
  useEffect(() => {
    if (!isUiOpen) {
      if (user && user?.id !== figma.currentUser.id) {
        figma.notify("Sorry, this avatar is created by someone else.");
        return;
      }
      waitForTask(
        new Promise((resolve) => {
          figma.showUI(`<script>window.location.href = "${process.env.WEB_URL}"</script>`, {
            height: 600,
            width: 400,
            position: {
              // top-right corner
              x: 100000,
              y: -100000,
            },
          });
          isUiOpen = true;
          figma.currentPage.selection = [];
        })
      );
    }
  });

  // Assign new widget to current user
  useEffect(() => {
    const widgetNode = figma.getNodeById(widgetId) as WidgetNode;
    if (user) return;

    // find and clean other instances of the same avatar
    figma.currentPage
      .findWidgetNodesByWidgetId(widgetNode.widgetId)
      .filter((node) => node.getPluginData("userId") === figma.currentUser.id)
      .forEach((instance) => instance.remove());

    widgetNode.name = figma.currentUser.name;
    widgetNode.setPluginData("userId", figma.currentUser.id);
    widgetNode.locked = true;

    const existingMapMetadataString = figma.currentPage.findChild((node) => node.getPluginDataKeys().includes("mapMetadata"))?.getPluginData("mapMetadata");
    if (existingMapMetadataString) {
      // spawn on map
      const data = JSON.parse(existingMapMetadataString) as MapMetadata;
      spawnWidgetOnMap(AVATAR_SIZE, widgetNode, data.spawnTiles[0]);
    } else {
      // request map
      sendToUI({ requestMap: true });
    }

    alignViewport(getNodeCenter(widgetNode));
    figma.viewport.zoom = 2;
    setUser(figma.currentUser);

    sendToUI({ defaultNickname: figma.currentUser.name });
  });

  // Request a map if none exists

  // Handle user input
  useEffect(() => {
    if (!user) return;
    if (user.id !== figma.currentUser.id) return;

    figma.ui.onmessage = async (message: MessageToMain) => {
      const widgetNode = figma.getNodeById(widgetId) as WidgetNode;

      if (message.findMyself) {
        alignViewport(getNodeCenter(widgetNode));
        figma.viewport.zoom = 2;
        widgetNode.parent.appendChild(widgetNode); // bring to front
      }

      if (typeof message.nickname === "string") {
        const displayNickname = message.nickname.length ? message.nickname : "???";
        setNickname(displayNickname);
        widgetNode.name = displayNickname;
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

      if (message.map) {
        const { name, rows, cols, key, imageBytes, spawnTiles } = message.map;
        const image = figma.createImage(imageBytes);

        const imageFill: ImagePaint = {
          type: "IMAGE",
          imageHash: image.hash,
          scaleMode: "FILL",
        };

        const mapMetadata: MapMetadata = { key, tileSize: AVATAR_SIZE, spawnTiles };

        // no effect on the same map, just update metadata
        const mapNodes = figma.currentPage.findChildren((node) => node.getPluginDataKeys().includes("mapMetadata"));
        if (mapNodes.length === 1 && JSON.parse(mapNodes[0].getPluginData("mapMetadata")).key === key) {
          console.log(`[map] already exists. Update metadata only`, mapMetadata);
          mapNodes[0].setPluginData("mapMetadata", JSON.stringify(mapMetadata));
          return;
        }

        // clean up other maps on the canvas
        figma.currentPage.findChildren((node) => node.getPluginDataKeys().includes("mapMetadata")).forEach((node) => node.remove());

        const rect = figma.createRectangle();
        rect.resize(cols * AVATAR_SIZE, rows * AVATAR_SIZE);
        rect.fills = [imageFill];
        rect.locked = true; // prevent accidental move
        rect.name = name;

        const allAvatarNodes = figma.currentPage.findWidgetNodesByWidgetId(widgetNode.widgetId);
        allAvatarNodes.forEach((node) => spawnWidgetOnMap(AVATAR_SIZE, node, spawnTiles[0]));

        alignViewport(getNodeCenter(widgetNode));

        rect.setPluginData("mapMetadata", JSON.stringify(mapMetadata));
        console.log("[map] updated", rect);
      }
    };
  });

  return (
    <AutoLayout tooltip={user?.name} onClick={noop} width={AVATAR_SIZE} height={AVATAR_SIZE} overflow="visible">
      <AutoLayout
        fill={user?.color}
        padding={{ vertical: 2, horizontal: 4 }}
        cornerRadius={0}
        positioning="absolute"
        stroke={"#000"}
        strokeWidth={2}
        x={{ type: "center", offset: 0 }}
        y={{ type: "top", offset: -24 }}
      >
        <Text fill="#fff" opacity={1} fontSize={12} horizontalAlignText="center">
          {nickname}
        </Text>
      </AutoLayout>
      {transform && imageUrl && (
        <Rectangle
          width={AVATAR_SIZE}
          height={AVATAR_SIZE}
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

function spawnWidgetOnMap(avatarSize: number, widgetNode: WidgetNode, spawnTile: TilePosition) {
  widgetNode.x = spawnTile.col * avatarSize;
  widgetNode.y = spawnTile.row * avatarSize;
  figma.currentPage.appendChild(widgetNode); // bring above the map
}

// This async function allows the widget to become a click target
async function noop() {}

figma.widget.register(Widget);
