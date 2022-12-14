import type { CharacterAtlas } from "../../interface";
import imgUrl from "./spritesheet.png";

const shared: Pick<CharacterAtlas, "details" | "cols" | "rows" | "tileSize"> = {
  details: [
    {
      key: "Artist",
      value: "Kacper Wozniak",
      link: "https://thkaspar.itch.io/",
    },
    {
      key: "License",
      value: "CC BY 4.0",
      link: "https://creativecommons.org/licenses/by/4.0/",
    },
  ],
  cols: 16,
  rows: 30,
  tileSize: 16,
};

export const lyster: CharacterAtlas = {
  ...shared,
  name: "Lyster",
  imgUrl,
  animations: {
    idleS: [{ row: 10, col: 0 }],
    idleW: [{ row: 9, col: 0, flipX: true }],
    idleN: [{ row: 11, col: 0 }],
    idleE: [{ row: 9, col: 0 }],
    walkS: [
      { row: 10, col: 4 },
      { row: 10, col: 5 },
      { row: 10, col: 6 },
      { row: 10, col: 5 },
    ],
    walkW: [
      { row: 9, col: 4, flipX: true },
      { row: 9, col: 5, flipX: true },
      { row: 9, col: 6, flipX: true },
      { row: 9, col: 5, flipX: true },
    ],
    walkN: [
      { row: 11, col: 4 },
      { row: 11, col: 5 },
      { row: 11, col: 6 },
      { row: 11, col: 5 },
    ],
    walkE: [
      { row: 9, col: 4 },
      { row: 9, col: 5 },
      { row: 9, col: 6 },
      { row: 9, col: 5 },
    ],
  },
};

export const bek: CharacterAtlas = {
  ...shared,
  name: "Bek",
  imgUrl,
  cols: 16,
  rows: 30,
  tileSize: 16,
  animations: {
    idleS: [{ row: 22, col: 0 }],
    idleW: [{ row: 21, col: 0, flipX: true }],
    idleN: [{ row: 23, col: 0 }],
    idleE: [{ row: 21, col: 0 }],
    walkS: [
      { row: 22, col: 1 },
      { row: 22, col: 2 },
      { row: 22, col: 3 },
      { row: 22, col: 2 },
    ],
    walkW: [
      { row: 21, col: 1, flipX: true },
      { row: 21, col: 2, flipX: true },
      { row: 21, col: 3, flipX: true },
      { row: 21, col: 2, flipX: true },
    ],
    walkN: [
      { row: 23, col: 1 },
      { row: 23, col: 2 },
      { row: 23, col: 3 },
      { row: 23, col: 2 },
    ],
    walkE: [
      { row: 21, col: 1 },
      { row: 21, col: 2 },
      { row: 21, col: 3 },
      { row: 21, col: 2 },
    ],
  },
};

export const dusa: CharacterAtlas = {
  ...shared,
  name: "Dusa",
  imgUrl,
  cols: 16,
  rows: 30,
  tileSize: 16,
  animations: {
    idleS: [{ row: 1, col: 0 }],
    idleW: [{ row: 0, col: 0, flipX: true }],
    idleN: [{ row: 2, col: 0 }],
    idleE: [{ row: 0, col: 0 }],
    walkS: [
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
      { row: 1, col: 2 },
      { row: 1, col: 5 },
      { row: 1, col: 6 },
      { row: 1, col: 7 },
      { row: 1, col: 6 },
    ],
    walkW: [
      { row: 0, col: 1, flipX: true },
      { row: 0, col: 2, flipX: true },
      { row: 0, col: 3, flipX: true },
      { row: 0, col: 2, flipX: true },
      { row: 0, col: 5, flipX: true },
      { row: 0, col: 6, flipX: true },
      { row: 0, col: 7, flipX: true },
      { row: 0, col: 6, flipX: true },
    ],
    walkN: [
      { row: 2, col: 1 },
      { row: 2, col: 2 },
      { row: 2, col: 3 },
      { row: 2, col: 2 },
    ],
    walkE: [
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
      { row: 0, col: 2 },
      { row: 0, col: 5 },
      { row: 0, col: 6 },
      { row: 0, col: 7 },
      { row: 0, col: 6 },
    ],
  },
};

export const ludwig: CharacterAtlas = {
  ...shared,
  name: "Ludwig",
  imgUrl,
  cols: 16,
  rows: 30,
  tileSize: 16,
  animations: {
    idleS: [{ row: 25, col: 0 }],
    idleW: [{ row: 24, col: 0, flipX: true }],
    idleN: [{ row: 26, col: 0 }],
    idleE: [{ row: 24, col: 0 }],
    walkS: [
      { row: 25, col: 1 },
      { row: 25, col: 2 },
      { row: 25, col: 3 },
      { row: 25, col: 2 },
    ],
    walkW: [
      { row: 24, col: 1, flipX: true },
      { row: 24, col: 2, flipX: true },
      { row: 24, col: 3, flipX: true },
      { row: 24, col: 2, flipX: true },
    ],
    walkN: [
      { row: 26, col: 1 },
      { row: 26, col: 2 },
      { row: 26, col: 3 },
      { row: 26, col: 2 },
    ],
    walkE: [
      { row: 24, col: 1 },
      { row: 24, col: 2 },
      { row: 24, col: 3 },
      { row: 24, col: 2 },
    ],
  },
};
