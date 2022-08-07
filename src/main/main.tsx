// This is a counter widget with buttons to increment and decrement the number.

import { walk } from "./sprite";

const { widget, showUI, createImage } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Rectangle, Text, SVG, Image, useWidgetId, useEffect } = widget;

function Widget() {
  const widgetId = useWidgetId();

  const [avatarIndex, setAvatarIndex] = useSyncedState("avatarIndex", 0);
  const [poseSpritePos, setPoseSpritePos] = useSyncedState("poseSpritePos", [0, 1]);

  const [user, setUser] = useSyncedState<User | null>("user", null);

  // Assign widget to current user
  useEffect(() => {
    const widgetNode = figma.getNodeById(widgetId) as WidgetNode;

    if (!user) {
      // find and clean other instances of the same avatar
      const otherInstances = figma.currentPage.findAll((node) => (node as WidgetNode).getPluginData("userId") === figma.currentUser.id);
      const lastInstance = [...otherInstances].pop() as WidgetNode | undefined;

      setUser(figma.currentUser);
      widgetNode.setPluginData("userId", figma.currentUser.id);

      if (lastInstance) {
        const avatarIndex = lastInstance.widgetSyncedState.avatarIndex;
        setAvatarIndex(avatarIndex);
        setPoseSpritePos(getAvatarPoseSpritePos(lastInstance.widgetSyncedState.avatarIndex, [0, 1]));
      }

      console.log(`Cleanup: ${otherInstances.length} other instances`);
      otherInstances.forEach((instance) => instance.remove());
    }
  });

  const getAvatarPoseSpritePos = (avatarIndex: number, posePos: [row: number, col: number]) => {
    const avatarBaseRow = Math.floor(avatarIndex / 5) * 4;
    const avatarBaseCol = (avatarIndex % 5) * 3;
    return [avatarBaseRow + posePos[0], avatarBaseCol + posePos[1]];
  };

  // Handle user input
  useEffect(() => {
    if (!user) return;
    if (user.id !== figma.currentUser.id) return;

    figma.ui.onmessage = (message) => {
      const widgetNode = figma.getNodeById(widgetId) as WidgetNode;

      if (message.dir) {
        const setPos = (pos: [row: number, col: number]) => setPoseSpritePos(getAvatarPoseSpritePos(avatarIndex, pos));

        switch (message.dir) {
          case "left":
            if (poseSpritePos[0] !== 1) {
              setPos([1, 1]);
            } else {
              setPos([1, (poseSpritePos[1] + 1) % 3]);
            }
            return (widgetNode.x -= 8);
          case "right":
            if (poseSpritePos[0] !== 2) {
              setPos([2, 1]);
            } else {
              setPos([2, (poseSpritePos[1] + 1) % 3]);
            }
            return (widgetNode.x += 8);
          case "up":
            if (poseSpritePos[0] !== 3) {
              setPos([3, 1]);
            } else {
              setPos([3, (poseSpritePos[1] + 1) % 3]);
            }
            return (widgetNode.y -= 8);
          case "down":
            if (poseSpritePos[0] !== 0) {
              setPos([0, 1]);
            } else {
              setPos([0, (poseSpritePos[1] + 1) % 3]);
            }
            return (widgetNode.y += 8);
        }
      }

      if (message.setAvatar) {
        switch (message.setAvatar) {
          case "prev":
            const prevIndex = (avatarIndex - 1) % 10;
            setAvatarIndex(prevIndex);
            setPoseSpritePos(getAvatarPoseSpritePos(prevIndex, [0, 1]));
            return;
          case "next":
            const nextIndex = (avatarIndex + 1) % 10;
            setAvatarIndex(nextIndex);
            setPoseSpritePos(getAvatarPoseSpritePos(nextIndex, [0, 1]));
            return;
        }
      }
    };
  });

  const handleAvatarClick = () => {
    const widgetNode = figma.getNodeById(widgetId) as WidgetNode;
    console.log(`Current widget`, widgetNode);
    console.log(`Current data`, user);

    if (user.id !== figma.currentUser.id) {
      console.log("Avatar created by a different user");
      return;
    }

    return new Promise((resolve) => {
      figma.showUI(__html__);
    });
  };

  const spriteGetter = getSpriteCell.bind(null, 8, 15);

  return (
    <AutoLayout horizontalAlignItems="center" direction="vertical" spacing={4}>
      <Text fontSize={12}>{user?.name}</Text>
      <Rectangle
        onClick={handleAvatarClick}
        fill={{ type: "image", imageTransform: spriteGetter(...poseSpritePos), src: walk, scaleMode: "crop" }}
        width={32}
        height={32}
      />
    </AutoLayout>
  );
}

function getSpriteCell(rows: number, cols: number, row: number, col: number) {
  return [
    [1 / cols, 0, col / cols],
    [0, 1 / rows, row / rows],
  ] as Transform;
}

widget.register(Widget);
