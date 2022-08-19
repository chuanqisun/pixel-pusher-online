import type { PrebuiltMap } from "../../interface";
import imgUrl from "./skoro.png";

export const skoro: PrebuiltMap = {
  name: "Skoro",
  rows: 24,
  cols: 32,
  tileSize: 16,
  details: [
    {
      key: "Tile artist",
      value: "analogStudios_",
      link: "https://analogstudios.itch.io/",
    },
    {
      key: "License",
      value: "CC0 1.0",
      link: "https://creativecommons.org/publicdomain/zero/1.0/",
    },
  ],
  spawnTiles: [
    { row: 15, col: 15 }, // Center left
    { row: 15, col: 16 }, // Center right
  ],
  imgUrl,
};
