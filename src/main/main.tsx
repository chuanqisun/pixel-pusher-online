// This is a counter widget with buttons to increment and decrement the number.

import { walk } from "./sprite";

const { widget, showUI, createImage } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Rectangle, Text, SVG, Image, useWidgetId, useEffect } = widget;

function Widget() {
  const widgetId = useWidgetId();

  const [spritePos, setSpritePos] = useSyncedState("spritePos", [0, 1]);

  const [user, setUser] = useSyncedState<User | null>("user", null);

  useEffect(() => {
    const widgetNode = figma.getNodeById(widgetId) as WidgetNode;
    if (!widgetNode) return;

    if (!widgetNode.getPluginData("user")) {
      widgetNode.setPluginData("user", JSON.stringify(figma.currentUser));
      setUser(figma.currentUser);
    }
  });

  useEffect(() => {
    figma.ui.onmessage = (message) => {
      const widgetNode = figma.getNodeById(widgetId) as WidgetNode;
      if (!widgetNode) return;

      if (message.dir) {
        switch (message.dir) {
          case "left":
            if (spritePos[0] !== 1) {
              setSpritePos([1, 1]);
            } else {
              setSpritePos([1, (spritePos[1] + 1) % 3]);
            }
            return (widgetNode.x -= 8);
          case "right":
            if (spritePos[0] !== 2) {
              setSpritePos([2, 1]);
            } else {
              setSpritePos([2, (spritePos[1] + 1) % 3]);
            }
            return (widgetNode.x += 8);
          case "up":
            if (spritePos[0] !== 3) {
              setSpritePos([3, 1]);
            } else {
              setSpritePos([3, (spritePos[1] + 1) % 3]);
            }
            return (widgetNode.y -= 8);
          case "down":
            if (spritePos[0] !== 0) {
              setSpritePos([0, 1]);
            } else {
              setSpritePos([0, (spritePos[1] + 1) % 3]);
            }
            return (widgetNode.y += 8);
        }
      }
    };
  });

  const handleAvatarClick = () => {
    const widgetNode = figma.getNodeById(widgetId) as WidgetNode;
    console.log(`Current widget`, widgetNode);
    const user = JSON.parse(widgetNode.getPluginData("user")) as User;
    console.log(`Current data`, user);

    return new Promise((resolve) => {
      figma.showUI(__html__);
    });
  };

  const spriteGetter = getSpriteCell.bind(null, 8, 15);

  return (
    <AutoLayout horizontalAlignItems="center" direction="vertical" spacing={4}>
      <Text fontSize={12}>{user ? user.name : "Click to claim"}</Text>
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

widget.register(Widget);
