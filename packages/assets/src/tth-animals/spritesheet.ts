import type { Atlas } from "../interface";
import { transforms } from "../utils";
import imgUrl from "./spritesheet.png";

export const animalRat01: Atlas = {
  imgUrl,
  cols: 16,
  rows: 30,
  cellSize: 16,
  animations: {
    idleS: [{ row: 10, col: 0 }],
    idleW: [{ row: 9, col: 0, transform: transforms.FLIP_HORIZONTAL }],
    idleN: [{ row: 11, col: 0 }],
    idleE: [{ row: 9, col: 0 }],
    walkS: [
      { row: 10, col: 4 },
      { row: 10, col: 5 },
      { row: 10, col: 6 },
      { row: 10, col: 7 },
    ],
    walkW: [
      { row: 9, col: 4, transform: transforms.FLIP_HORIZONTAL },
      { row: 9, col: 5, transform: transforms.FLIP_HORIZONTAL },
      { row: 9, col: 6, transform: transforms.FLIP_HORIZONTAL },
      { row: 9, col: 7, transform: transforms.FLIP_HORIZONTAL },
    ],
    walkN: [
      { row: 11, col: 4 },
      { row: 11, col: 5 },
      { row: 11, col: 6 },
      { row: 11, col: 7 },
    ],
    walkE: [
      { row: 9, col: 4 },
      { row: 9, col: 5 },
      { row: 9, col: 6 },
      { row: 9, col: 7 },
    ],
  },
};
