import type { TilePosition } from "types";

export interface PrebuiltMap {
  name: string;
  imgUrl: string;
  rows: number;
  cols: number;
  tileSize: number;
  details: DetailItem[];
  spawnTiles: TilePosition[];
}

export interface CharacterAtlas {
  name: string;
  imgUrl: string;
  rows: number;
  cols: number;
  tileSize: number;
  animations: Record<string, Frame[]>;
  details: DetailItem[];
}

export interface DetailItem {
  key: string;
  value: string;
  link?: string;
}
export interface Frame extends TilePosition {
  flipX?: boolean;
  duration?: number;
}
