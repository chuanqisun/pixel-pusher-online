import type { PrebuiltMap } from "../interface";
import imgUrl from "./hunters-tavern.png";

export const huntersTavern: PrebuiltMap = {
  name: "Hunter’s Tavern",
  rows: 24,
  cols: 32,
  tileSize: 16,
  details: [
    {
      key: "Map artist",
      value: "d0tn3t",
      link: "https://chuanqisun.com",
    },
    {
      key: "Tile artist",
      value: "o_lobster",
      link: "https://o-lobster.itch.io/",
    },
    {
      key: "License",
      value: "CC0 1.0",
      link: "https://creativecommons.org/publicdomain/zero/1.0/",
    },
  ],
  spawnTiles: [
    { row: 11, col: 15 }, // Center
  ],
  imgUrl,
};
