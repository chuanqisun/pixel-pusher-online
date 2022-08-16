export interface MessageToUI {
  defaultNickname?: string;
  requestMap?: true;
  reset?: true;
  historyMessages?: HistoryMessage[];
}

export interface MessageToMain {
  findMyself?: true;
  nickname?: string;
  transform?: AffineMatrix;
  newMessage?: NewMessage;
  map?: MapSelection;
  move?: Direction;
  avatarUrl?: string;
  getHistoryMessages?: GetMessage;
}

export type AffineMatrix = [[scaleX: number, skewX: number, translateX: number], [skewY: number, scaleY: number, translateY: number]];

export interface HistoryMessage {
  msgId: string;
  fromId: string;
  fromNickname: string;
  fromColor: string;
  timestamp: number;
  content: string;
}

export interface NewMessage {
  content: string;
}

export interface GetMessage {
  lastId?: string;
}

export type Direction = "N" | "E" | "S" | "W";

export interface MapSelection {
  name: string;
  key: string;
  imageBytes: Uint8Array;
  rows: number;
  cols: number;
  spawnTiles: TilePosition[];
}

export interface TilePosition {
  row: number;
  col: number;
}
