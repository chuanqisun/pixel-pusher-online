// This is a counter widget with buttons to increment and decrement the number.

const { widget, showUI } = figma;
const { useSyncedState, usePropertyMenu, Rectangle, Text, SVG } = widget;

figma.ui.onmessage = (message) => {
  const avatar = figma.currentPage.selection[0] as WidgetNode | undefined;
  console.log(avatar);
  if (!avatar) return;

  switch (message.dir) {
    case "up":
      return (avatar.y -= 8);
    case "down":
      return (avatar.y += 8);
  }
};

function Widget() {
  const [pos, setPos] = useSyncedState("x", [0, 0]);

  const openControlPanel = () =>
    new Promise((resolve) => {
      figma.showUI(__html__);
    });

  return <Rectangle onClick={openControlPanel} width={40} height={40} x={pos[0]} y={pos[1]} fill="#333333" />;
}

widget.register(Widget);
