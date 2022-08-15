export interface PrebuiltMap {
  name: string;
  imgUrl: string;
  rows: number;
  cols: number;
  tileSize: number;
  details: DetailItem[];
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
export interface Frame {
  row: number;
  col: number;
  flipX?: boolean;
  duration?: number;
}
