// This is a counter widget with buttons to increment and decrement the number.

import type { Atlas, Frame } from "assets";

const { widget, showUI, createImage } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Frame, Rectangle, Text, SVG, Image, useWidgetId, useEffect, waitForTask } = widget;

let isUiOpen = false;

function Widget() {
  const widgetId = useWidgetId();

  // [1..10]
  const [avatar, setAvatar] = useSyncedState("avatarIndex", 0);

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

  // Initialize widget to current user
  useEffect(() => {
    const widgetNode = figma.getNodeById(widgetId) as WidgetNode;

    if (!user) {
      // find and clean other instances of the same avatar
      const otherInstances = figma.currentPage.findAll((node) => (node as WidgetNode).getPluginData("userId") === figma.currentUser.id);

      waitForTask(
        (async () => {
          const nickname = (await figma.clientStorage.getAsync("nickname")) ?? figma.currentUser.name;
          const avatarIndex = (await figma.clientStorage.getAsync("avatarIndex")) ?? 0;

          setUser(figma.currentUser);
          setNickname(nickname);
          setAvatar(avatarIndex);

          widgetNode.setPluginData("userId", figma.currentUser.id);

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
      const widgetNode = figma.getNodeById(widgetId) as WidgetNode;

      if (message.focusCharacter) {
        resetViewport(widgetNode);
      }

      if (message.setNickname) {
        await figma.clientStorage.setAsync("nickname", message.setNickname);
        figma.notify(`Nickname updated to "${message.setNickname}"`);

        setNickname(message.setNickname);
      }

      if (message.frame) {
        setFrame(message.frame);
      }

      if (message.setAvatar) {
        setAvatarV2(message.setAvatar);
      }
    };
  });

  const handleMove = (dir: any, node: WidgetNode) => {
    resetViewport(node);
  };

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

function mapPoseFrameToSpriteFrame(pose: number) {
  // reuse the idle pose the 4th frame
  return [0, 1, 2, 1][pose];
}

function resetViewport(node: WidgetNode) {
  figma.viewport.zoom = 1;
  figma.viewport.center = {
    x: node.x + (node.width >> 1),
    y: node.y + (node.height >> 1),
  };
}

widget.register(Widget);
