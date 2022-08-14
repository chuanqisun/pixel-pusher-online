export interface Atlas {
  imgUrl: string;
  rows: number;
  cols: number;
  cellSize: number;
  animations: Record<string, Frame[]>;
}

export interface Frame {
  row: number;
  col: number;
  flipX?: boolean;
  duration?: number;
}
