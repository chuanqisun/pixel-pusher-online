import type { CharacterAtlas } from "../../interface";
import imgUrl from "./01-generic.png";

const shared: Pick<CharacterAtlas, "details" | "cols" | "rows" | "tileSize"> = {
  details: [
    {
      key: "Artist",
      value: "javikolog",
      link: "https://route1rodent.itch.io/",
    },
    {
      key: "License",
      value: "CC BY-SA 3.0",
      link: "https://creativecommons.org/licenses/by-sa/3.0/",
    },
  ],
  cols: 15,
  rows: 8,
  tileSize: 16,
};

export const alec: CharacterAtlas = {
  ...shared,
  name: "Alec",
  imgUrl: imgUrl,
  animations: {
    idleN: [{ row: 3, col: 1 }],
    idleE: [{ row: 2, col: 1 }],
    idleS: [{ row: 0, col: 1 }],
    idleW: [{ row: 1, col: 1 }],
    walkN: [
      { row: 3, col: 0 },
      { row: 3, col: 1 },
      { row: 3, col: 2 },
      { row: 3, col: 1 },
    ],
    walkE: [
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
      { row: 2, col: 1 },
    ],
    walkS: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 1 },
    ],
    walkW: [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 1 },
    ],
  },
};

export const meg: CharacterAtlas = {
  ...shared,
  name: "Meg",
  imgUrl: imgUrl,
  animations: {
    idleN: [{ row: 3, col: 7 }],
    idleE: [{ row: 2, col: 7 }],
    idleS: [{ row: 0, col: 7 }],
    idleW: [{ row: 1, col: 7 }],
    walkN: [
      { row: 3, col: 6 },
      { row: 3, col: 7 },
      { row: 3, col: 8 },
      { row: 3, col: 7 },
    ],
    walkE: [
      { row: 2, col: 6 },
      { row: 2, col: 7 },
      { row: 2, col: 8 },
      { row: 2, col: 7 },
    ],
    walkS: [
      { row: 0, col: 6 },
      { row: 0, col: 7 },
      { row: 0, col: 8 },
      { row: 0, col: 7 },
    ],
    walkW: [
      { row: 1, col: 6 },
      { row: 1, col: 7 },
      { row: 1, col: 8 },
      { row: 1, col: 7 },
    ],
  },
};
