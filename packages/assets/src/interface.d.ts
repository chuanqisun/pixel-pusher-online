export interface Atlas {
  imgUrl: string;
  mapWidth: number;
  mapHeight: number;
  cellSize: number;
  animations: Record<string, Frame[]>;
}

export interface Frame {
  row: number;
  col: number;
  transform?: number[];
  duration?: number;
}
