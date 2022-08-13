export function sendMessage(iframeHostOrigin: string, pluginId: string, message: any) {
  parent.postMessage({ pluginMessage: message, pluginId }, iframeHostOrigin);
}
