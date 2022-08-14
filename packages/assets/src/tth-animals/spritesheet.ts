import type { Atlas } from "../interface";
import imgUrl from "./spritesheet.png";

export const animalRat01: Atlas = {
  imgUrl,
  cols: 16,
  rows: 30,
  cellSize: 16,
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

export const animalSheep01: Atlas = {
  imgUrl,
  cols: 16,
  rows: 30,
  cellSize: 16,
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
