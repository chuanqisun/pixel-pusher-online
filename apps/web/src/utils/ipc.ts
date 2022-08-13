const PLUGIN_ID = "1137434697958861539";

export function sendMessage(pluginId: string, message: any) {
  parent.postMessage({ pluginMessage: message, pluginId }, "https://www.figma.com");
}

export const sendToMain = sendMessage.bind(null, PLUGIN_ID);
