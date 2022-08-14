export interface MessageToUI {
  defaultNickname?: string;
  reset?: ture;
  historyMessages?: HistoryMessage[];
}

export interface MessageToMain {
  findMyself?: true;
  nickname?: string;
  transform?: AffineMatrix;
  newMessage?: NewMessage;
  move?: Direction;
  imgUrl?: string;
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

export type Direction = "N" | "E" | "S" | "W";