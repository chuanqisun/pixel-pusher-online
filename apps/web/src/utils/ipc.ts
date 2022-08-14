import type { MessageToMain } from "types";

export function sendMessage(iframeHostOrigin: string, pluginId: string, message: MessageToMain) {
  parent.postMessage({ pluginMessage: message, pluginId }, iframeHostOrigin);
}
