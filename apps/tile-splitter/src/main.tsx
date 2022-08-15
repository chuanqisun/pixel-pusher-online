const TILE_SIZE = 16;
const GAP = 2;

const node = figma.currentPage.selection[0] as RectangleNode;
if (node?.type !== "RECTANGLE") {
  figma.notify("Selection is not an image");
}

const { width, height } = node;

const imageFill = node.fills?.[0] as ImagePaint;
if (imageFill?.type !== "IMAGE") {
  figma.notify("Selection is not an image");
}

const rowLen = Math.round(height / TILE_SIZE); // divider by 16
const colLen = Math.round(width / TILE_SIZE);

const rows = [...Array(rowLen).keys()]; // divider by 16
const cols = [...Array(colLen).keys()]; // divider by 16

for (let row of rows) {
  for (let col of cols) {
    const transform = [
      [1 / colLen, 0, col / colLen],
      [0, 1 / rowLen, row / rowLen],
    ] as Transform;
    const cloned = node.clone();
    cloned.fills = [{ ...imageFill, scaleMode: "CROP", imageTransform: transform }];
    cloned.resize(TILE_SIZE, TILE_SIZE);
    cloned.x = node.x + col * (TILE_SIZE + GAP);
    cloned.y = node.y + height + row * (TILE_SIZE + GAP);
    console.log(transform);
  }
}

figma.closePlugin();
