// This is a counter widget with buttons to increment and decrement the number.

import type { Atlas, Frame } from "assets";

const { useSyncedState, AutoLayout, Frame, Rectangle, Text, useWidgetId, useEffect, waitForTask } = figma.widget;

let isUiOpen = false;

function Widget() {
  const widgetId = useWidgetId();

  const [avatarV2, setAvatarV2] = useSyncedState<Atlas | null>("avatarV2", null);
  const [frame, setFrame] = useSyncedState<Frame | null>("frame", null);

  const [user, setUser] = useSyncedState<User | null>("user", null);
  const [nickname, setNickname] = useSyncedState("nickname", "");

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

    if (!user) {
      // find and clean other instances of the same avatar
      const otherInstances = figma.currentPage.findAll((node) => (node as WidgetNode).getPluginData("userId") === figma.currentUser.id);

      waitForTask(
        (async () => {
          setUser(figma.currentUser);

          widgetNode.setPluginData("userId", figma.currentUser.id);
          figma.ui.postMessage({ defaultNickname: figma.currentUser.name });

          console.log(`Cleanup: ${otherInstances.length} other instances`);
          otherInstances.forEach((instance) => instance.remove());
        })()
      );
    }
  });

  // Handle user input
  useEffect(() => {
    if (!user) return;
    if (user.id !== figma.currentUser.id) return;

    figma.ui.onmessage = async (message) => {
      console.log(`[ipc] received from UI`, message);
      const widgetNode = figma.getNodeById(widgetId) as WidgetNode;

      if (message.focusCharacter) {
        resetViewport(widgetNode);
      }

      if (message.setNickname) {
        setNickname(message.setNickname);
      }

      if (message.frame) {
        setFrame(message.frame);
      }

      if (message.move) {
        switch (message.move) {
          case "N":
            widgetNode.y -= 8;
            break;
          case "E":
            widgetNode.x += 8;
            break;
          case "S":
            widgetNode.y += 8;
            break;
          case "W":
            widgetNode.x -= 8;
            break;
        }
      }

      if (message.setAvatar) {
        setAvatarV2(message.setAvatar);
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
      {frame && avatarV2 && (
        <Rectangle
          onClick={handleAvatarClick}
          width={32}
          height={32}
          fill={{
            type: "image",
            scaleMode: "crop",
            imageTransform: [
              [1 / avatarV2.cols, 0, frame.col / avatarV2.cols],
              [0, 1 / avatarV2.rows, frame.row / avatarV2.rows],
            ],
            src: avatarV2.imgUrl,
          }}
        />
      )}
    </AutoLayout>
  );
}

function resetViewport(node: WidgetNode) {
  figma.viewport.zoom = 1;
  figma.viewport.center = {
    x: node.x + (node.width >> 1),
    y: node.y + (node.height >> 1),
  };
}

figma.widget.register(Widget);
