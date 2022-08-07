// This is a counter widget with buttons to increment and decrement the number.

import { walk } from "./sprite";

const { widget, showUI, createImage } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Rectangle, Text, SVG, Image, useWidgetId, useEffect, waitForTask } = widget;

function Widget() {
  const widgetId = useWidgetId();

  // [1..10]
  const [avatar, setAvatar] = useSyncedState("avatarIndex", 0);

  // [[S|W|E|N], [L|C|R|C]]
  const [pose, setPose] = useSyncedState("poseSpritePos", [0, 1]);

  // Sprite pos
  const [spritePos, setSpritePos] = useSyncedState("spritePos", getSpritePos(avatar, pose as [number, number]));

  // Auto walk
  const [isAutoWalk, setIsAutoWalk] = useSyncedState("isAutoWalk", false);

  const [user, setUser] = useSyncedState<User | null>("user", null);

  useEffect(() => {
    const newRenderPos = getSpritePos(avatar, pose as [number, number]);
    if (newRenderPos[0] === spritePos[0] && newRenderPos[1] === spritePos[1]) return;

    setSpritePos(newRenderPos);
  });

  useEffect(() => {
    isAutoWalk &&
      waitForTask(
        new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        })
      );
  });

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
        setAvatar(avatarIndex);
      }

      console.log(`Cleanup: ${otherInstances.length} other instances`);
      otherInstances.forEach((instance) => instance.remove());
    }
  });

  // Handle user input
  useEffect(() => {
    if (!user) return;
    if (user.id !== figma.currentUser.id) return;

    figma.ui.onmessage = (message) => {
      const widgetNode = figma.getNodeById(widgetId) as WidgetNode;

      if (message.dir) {
        handleMove(message.dir, widgetNode);
      }

      if (message.setAvatar) {
        switch (message.setAvatar) {
          case "prev":
            const prevIndex = (10 + avatar - 1) % 10;
            setAvatar(prevIndex);
            return;
          case "next":
            const nextIndex = (avatar + 1) % 10;
            setAvatar(nextIndex);
            return;
        }
      }

      if (message.toggleAutoWalk) {
        setIsAutoWalk((prev) => !prev);
      }
    };
  });

  const handleMove = (dir: any, node: WidgetNode) => {
    switch (dir) {
      case "left":
        if (pose[0] !== 1) {
          setPose([1, 1]);
        } else {
          setPose([1, (pose[1] + 1) % 4]);
          node.x -= 8;
        }
        break;
      case "right":
        if (pose[0] !== 2) {
          setPose([2, 1]);
        } else {
          setPose([2, (pose[1] + 1) % 4]);
          node.x += 8;
        }
        break;
      case "up":
        if (pose[0] !== 3) {
          setPose([3, 1]);
        } else {
          setPose([3, (pose[1] + 1) % 4]);
          node.x += 8;
        }
        break;
      case "down":
        if (pose[0] !== 0) {
          setPose([0, 1]);
        } else {
          setPose([0, (pose[1] + 1) % 4]);
          node.x += 8;
        }
        break;
    }
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
      figma.showUI(__html__);
    });
  };

  const spriteGetter = getSpriteCell.bind(null, 8, 15);

  return (
    <AutoLayout horizontalAlignItems="center" direction="vertical" spacing={4}>
      <Text fontSize={12}>{user?.name}</Text>
      <Rectangle
        onClick={handleAvatarClick}
        fill={{ type: "image", imageTransform: spriteGetter(...spritePos), src: walk, scaleMode: "crop" }}
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

function getSpritePos(avatar: number, pose: [row: number, col: number]) {
  const avatarBaseRow = Math.floor(avatar / 5) * 4;
  const avatarBaseCol = (avatar % 5) * 3;
  return [avatarBaseRow + pose[0], avatarBaseCol + mapPoseToSprite(pose[1])];
}

function mapPoseToSprite(pos: number) {
  // reuse the idle pose the 4th frame
  return [0, 1, 2, 1][pos];
}

widget.register(Widget);
