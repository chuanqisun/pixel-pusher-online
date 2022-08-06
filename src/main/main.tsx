// This is a counter widget with buttons to increment and decrement the number.

const { widget, showUI } = figma;
const { useSyncedState, usePropertyMenu, Rectangle, Text, SVG, useWidgetId, useEffect } = widget;

function Widget() {
  const widgetId = useWidgetId();

  useEffect(() => {
    figma.ui.onmessage = (message) => {
      const widgetNode = figma.getNodeById(widgetId) as WidgetNode;
      if (!widgetNode) return;

      switch (message.dir) {
        case "left":
          return (widgetNode.x -= 8);
        case "right":
          return (widgetNode.x += 8);
        case "up":
          return (widgetNode.y -= 8);
        case "down":
          return (widgetNode.y += 8);
      }
    };
  });
  const openControlPanel = () =>
    new Promise((resolve) => {
      figma.showUI(__html__);
    });

  return <Rectangle onClick={openControlPanel} width={40} height={40} fill="#333333" />;
}

widget.register(Widget);
