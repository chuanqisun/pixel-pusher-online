import type { Atlas } from "../interface";
import imgUrl from "./01-generic.png";

export const rpgGeneric01: Atlas = {
  imgUrl,
  cols: 15,
  rows: 8,
  cellSize: 16,
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
