import type { PrebuiltMap } from "../interface";
import imgUrl from "./leoford.png";

export const leowood: PrebuiltMap = {
  name: "Leowood",
  rows: 24,
  cols: 32,
  tileSize: 16,
  details: [
    {
      key: "Map design",
      value: "d0tn3t",
      link: "https://chuanqisun.com",
    },
    {
      key: "Tile design",
      value: "franopx",
      link: "https://franopx.itch.io",
    },
  ],
  spawnTiles: [
    { row: 7, col: 15 }, // Inn
    { row: 8, col: 7 }, // Pub
    { row: 17, col: 10 }, // Hispital
  ],
  imgUrl,
};
