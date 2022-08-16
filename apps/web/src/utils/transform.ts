import type { CharacterAtlas, Frame } from "assets";

export const AVATAR_SIZE = 32;

export interface DisplayFrame {
  url: string;
  mapWidth: number;
  mapHeight: number;
  x: number;
  y: number;
  size: number;
  flipX?: boolean;
}

export function getDisplayFrame(scale: number, atlas: CharacterAtlas, frame: Frame): DisplayFrame {
  const { col, row, flipX } = frame;
  const size = atlas.tileSize * scale;
  const x = size * col;
  const y = size * row;
  const url = atlas.imgUrl;
  const mapWidth = atlas.cols * size;
  const mapHeight = atlas.rows * size;

  return { mapWidth, mapHeight, x, y, flipX, url, size };
}

export function getFigmaImageTransform(atlas: CharacterAtlas, frame: Frame) {
  // figma transforms the viewport, not the image
  // transform origin is top-left
  // figma applies scale and skew first, then translate
  const scaleX = frame.flipX ? -1 : 1;
  const col = frame.col + (frame.flipX ? 1 : 0); // when flipped, viewport starts at (-1, 0)

  return [
    [scaleX / atlas.cols, 0, col / atlas.cols],
    [0, 1 / atlas.rows, frame.row / atlas.rows],
  ];
}

export function getFrameCss({ url, mapWidth, mapHeight, x, y, size, flipX }: DisplayFrame) {
  return {
    transform: flipX ? `matrix(-1, 0, 0, 1, 0, 0)` : undefined, // css transform origin is center by default
    width: size,
    height: size,
    backgroundImage: `url("${url}")`,
    backgroundPosition: `-${x}px -${y}px`,
    backgroundSize: `${mapWidth}px ${mapHeight}px`,
  };
}

export function getStaticDemoFrame(scale: number, atlas: CharacterAtlas) {
  return getFrameCss(getDisplayFrame(scale, atlas, atlas.animations.idleS[0]));
}

export function getScale(targetSize: number, srcSize: number) {
  return Math.floor(targetSize / srcSize); // TODO optimize perf
}

export const getAvatarScale = getScale.bind(null, AVATAR_SIZE);
