// This is a counter widget with buttons to increment and decrement the number.

import { walk } from "./sprite";

const { widget, showUI, createImage } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Frame, Rectangle, Text, SVG, Image, useWidgetId, useEffect, waitForTask } = widget;

let isUiOpen = false;

function Widget() {
  const widgetId = useWidgetId();

  // [1..10]
  const [avatar, setAvatar] = useSyncedState("avatarIndex", 0);

  // [[S|W|E|N], [L|C|R|C]]
  const [pose, setPose] = useSyncedState<[number, number]>("poseSpritePos", [0, 1]);

  // Sprite pos
  const [spritePos, setSpritePos] = useSyncedState("spritePos", getSpritePos(avatar, pose));

  const [emote, setEmote] = useSyncedState("emote", "");

  const [user, setUser] = useSyncedState<User | null>("user", null);
  const [nickname, setNickname] = useSyncedState("nickname", "");

  // Auto-open UI on creation
  useEffect(() => {
    if (!isUiOpen)
      waitForTask(
        new Promise((resolve) => {
          figma.showUI(__html__, { height: 600, width: 400 });
          isUiOpen = true;
          figma.currentPage.selection = [];
        })
      );
  });

  useEffect(() => {
    const newRenderPos = getSpritePos(avatar, pose);
    if (newRenderPos[0] === spritePos[0] && newRenderPos[1] === spritePos[1]) return;

    setSpritePos(newRenderPos);
  });

  // Assign widget to current user
  useEffect(() => {
    const widgetNode = figma.getNodeById(widgetId) as WidgetNode;

    if (!user) {
      // find and clean other instances of the same avatar
      const otherInstances = figma.currentPage.findAll((node) => (node as WidgetNode).getPluginData("userId") === figma.currentUser.id);
      const lastInstance = [...otherInstances].pop() as WidgetNode | undefined;

      setUser(figma.currentUser);
      setNickname(figma.currentUser.name);
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

      if (message.focusCharacter) {
        figma.viewport.scrollAndZoomIntoView([widgetNode]);
        figma.viewport.zoom = 1;
      }

      if (message.setNickname) {
        figma.notify(`Nickname updated to "${message.setNickname}"`);
        setNickname(message.setNickname);
      }

      if (message.dir) {
        handleMove(message.dir, widgetNode);
      }

      if (message.emote) {
        setEmote(message.emote === "Clear" ? "" : message.emote);
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
    };
  });

  const handleMove = (dir: any, node: WidgetNode) => {
    switch (dir) {
      case "w":
        if (pose[0] !== 1) {
          setPose([1, 1]);
        } else {
          setPose([1, (pose[1] + 1) % 4]);
          node.x -= 8;
        }
        break;
      case "e":
        if (pose[0] !== 2) {
          setPose([2, 1]);
        } else {
          setPose([2, (pose[1] + 1) % 4]);
          node.x += 8;
        }
        break;
      case "n":
        if (pose[0] !== 3) {
          setPose([3, 1]);
        } else {
          setPose([3, (pose[1] + 1) % 4]);
          node.y -= 8;
        }
        break;
      case "s":
        if (pose[0] !== 0) {
          setPose([0, 1]);
        } else {
          setPose([0, (pose[1] + 1) % 4]);
          node.y += 8;
        }
        break;
    }

    figma.viewport.scrollAndZoomIntoView([node]);
    figma.viewport.zoom = 1;
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
      figma.showUI(__html__, { height: 600, width: 400 });
    });
  };

  const spriteGetter = getSpriteCell.bind(null, 8, 15);

  return (
    <AutoLayout tooltip={user?.name} width={32} height={32} overflow="visible">
      <Rectangle
        onClick={handleAvatarClick}
        fill={{ type: "image", imageTransform: spriteGetter(...spritePos), src: walk, scaleMode: "crop" }}
        width={32}
        height={32}
      />

      <AutoLayout
        opacity={emote ? 0.2 : 1}
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

      <AutoLayout
        hidden={!emote}
        positioning="absolute"
        width={48}
        height={48}
        padding={8}
        cornerRadius={24}
        stroke={"#000"}
        strokeWidth={2}
        fill="#fff"
        x={{ type: "right", offset: -32 }}
        y={{ type: "top", offset: -48 }}
      >
        <Text fontSize={32}>{emote}</Text>
      </AutoLayout>
    </AutoLayout>
  );
}

function getSpriteCell(rows: number, cols: number, row: number, col: number) {
  return [
    [1 / cols, 0, col / cols],
    [0, 1 / rows, row / rows],
  ] as Transform;
}

function getSpritePos(avatar: number, pose: number[]): [row: number, col: number] {
  const avatarBaseRow = Math.floor(avatar / 5) * 4;
  const avatarBaseCol = (avatar % 5) * 3;
  return [avatarBaseRow + pose[0], avatarBaseCol + mapPoseFrameToSpriteFrame(pose[1])];
}

function mapPoseFrameToSpriteFrame(pose: number) {
  // reuse the idle pose the 4th frame
  return [0, 1, 2, 1][pose];
}

function getOrientation(pose: number[]) {
  return (["s", "w", "e", "n"] as const)[pose[0]];
}

widget.register(Widget);
