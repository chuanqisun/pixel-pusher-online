import type { PrebuiltMap } from "../../interface";
import imgUrl from "./calatan.png";

export const calatan: PrebuiltMap = {
  name: "Calatan",
  rows: 24,
  cols: 32,
  tileSize: 16,
  details: [
    {
      key: "Tile artist",
      value: "Kia",
      link: "https://itch.io/profile/kia",
    },
  ],
  spawnTiles: [
    { row: 12, col: 15 }, // Center
  ],
  imgUrl,
};
