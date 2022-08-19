import type { CharacterAtlas } from "../../interface";
import genericImgUrl from "./01-generic.png";
import bardImgUrl from "./02-bard.png";

const genericShared: Pick<CharacterAtlas, "details" | "cols" | "rows" | "tileSize"> = {
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

const bardShared: Pick<CharacterAtlas, "details" | "cols" | "rows" | "tileSize"> = {
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
  cols: 12,
  rows: 8,
  tileSize: 16,
};

export const alec: CharacterAtlas = {
  ...genericShared,
  name: "Alec",
  imgUrl: genericImgUrl,
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

export const leif: CharacterAtlas = {
  ...genericShared,
  name: "Leif",
  imgUrl: genericImgUrl,
  animations: {
    idleN: [{ row: 3, col: 10 }],
    idleE: [{ row: 2, col: 10 }],
    idleS: [{ row: 0, col: 10 }],
    idleW: [{ row: 1, col: 10 }],
    walkN: [
      { row: 3, col: 9 },
      { row: 3, col: 10 },
      { row: 3, col: 11 },
      { row: 3, col: 10 },
    ],
    walkE: [
      { row: 2, col: 9 },
      { row: 2, col: 10 },
      { row: 2, col: 11 },
      { row: 2, col: 10 },
    ],
    walkS: [
      { row: 0, col: 9 },
      { row: 0, col: 10 },
      { row: 0, col: 11 },
      { row: 0, col: 10 },
    ],
    walkW: [
      { row: 1, col: 9 },
      { row: 1, col: 10 },
      { row: 1, col: 11 },
      { row: 1, col: 10 },
    ],
  },
};

export const meg: CharacterAtlas = {
  ...genericShared,
  name: "Meg",
  imgUrl: genericImgUrl,
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

export const ayla: CharacterAtlas = {
  ...genericShared,
  name: "Ayla",
  imgUrl: genericImgUrl,
  animations: {
    idleN: [{ row: 3, col: 13 }],
    idleE: [{ row: 2, col: 13 }],
    idleS: [{ row: 0, col: 13 }],
    idleW: [{ row: 1, col: 13 }],
    walkN: [
      { row: 3, col: 12 },
      { row: 3, col: 13 },
      { row: 3, col: 14 },
      { row: 3, col: 13 },
    ],
    walkE: [
      { row: 2, col: 12 },
      { row: 2, col: 13 },
      { row: 2, col: 14 },
      { row: 2, col: 13 },
    ],
    walkS: [
      { row: 0, col: 12 },
      { row: 0, col: 13 },
      { row: 0, col: 14 },
      { row: 0, col: 13 },
    ],
    walkW: [
      { row: 1, col: 12 },
      { row: 1, col: 13 },
      { row: 1, col: 14 },
      { row: 1, col: 13 },
    ],
  },
};

export const kradin: CharacterAtlas = {
  ...bardShared,
  name: "Kradin",
  imgUrl: bardImgUrl,
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

export const takari: CharacterAtlas = {
  ...bardShared,
  name: "Takari",
  imgUrl: bardImgUrl,
  animations: {
    idleN: [{ row: 7, col: 4 }],
    idleE: [{ row: 6, col: 4 }],
    idleS: [{ row: 4, col: 4 }],
    idleW: [{ row: 5, col: 4 }],
    walkN: [
      { row: 7, col: 3 },
      { row: 7, col: 4 },
      { row: 7, col: 5 },
      { row: 7, col: 4 },
    ],
    walkE: [
      { row: 6, col: 3 },
      { row: 6, col: 4 },
      { row: 6, col: 5 },
      { row: 6, col: 4 },
    ],
    walkS: [
      { row: 4, col: 3 },
      { row: 4, col: 4 },
      { row: 4, col: 5 },
      { row: 4, col: 4 },
    ],
    walkW: [
      { row: 5, col: 3 },
      { row: 5, col: 4 },
      { row: 5, col: 5 },
      { row: 5, col: 4 },
    ],
  },
};
