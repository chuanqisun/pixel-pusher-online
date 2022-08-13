import type { Atlas, Frame } from "assets";

export interface DisplayFrame {
  url: string;
  mapWidth: number;
  mapHeight: number;
  x: number;
  y: number;
  size: number;
  transform?: number[];
}

export function getDisplayFrame(scale: number, atlas: Atlas, frame: Frame): DisplayFrame {
  const { col, row, transform } = frame;
  const size = atlas.cellSize * scale;
  const x = size * col;
  const y = size * row;
  const url = atlas.imgUrl;
  const mapWidth = atlas.cols * size;
  const mapHeight = atlas.rows * size;

  return { mapWidth, mapHeight, x, y, transform, url, size };
}

export function getFrameCss({ url, mapWidth, mapHeight, x, y, size, transform }: DisplayFrame) {
  return {
    transform: transform ? `matrix(${transform.join(", ")})` : undefined,
    width: size,
    height: size,
    backgroundImage: `url("${url}")`,
    backgroundPosition: `-${x}px -${y}px`,
    backgroundSize: `${mapWidth}px ${mapHeight}px`,
  };
}

export function getStaticDemoFrame(scale: number, atlas: Atlas) {
  return getFrameCss(getDisplayFrame(scale, atlas, atlas.animations.idleS[0]));
}

export function getScale(targetSize: number, srcSize: number) {
  return Math.floor(targetSize / srcSize); // TODO optimize perf
}

export const getAvatarScale = getScale.bind(null, 32);
