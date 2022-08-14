import type { HistoryMessage, MessageToUI } from "types";

export default {};
console.log("[debug-shim] ready");

window.addEventListener("message", (e) => {
  console.log(e.data?.pluginMessage);
});

window.addEventListener("click", (e) => {
  const action = (e.target as HTMLElement).closest("[data-action]")?.getAttribute("data-action");
  switch (action) {
    case "reset":
      sendMessageFromMockMain({ reset: true });
      break;
    case "init-nickname":
      sendMessageFromMockMain({ defaultNickname: "Test user" });
      break;
    case "init-chat-history":
      sendMessageFromMockMain({
        historyMessages: getMockHistory(),
      });
      break;
  }
});

function sendMessageFromMockMain(message: MessageToUI) {
  document.querySelector("iframe")!.contentWindow!.postMessage({ pluginMessage: message });
}

function getMockHistory(): HistoryMessage[] {
  return [
    {
      msgId: "mock-msg-01",
      fromId: "mock-user-01",
      fromNickname: "Alice (test)",
      fromColor: "#779900",
      content: "Test message 1",
      timestamp: Date.now() - 60000,
    },
    {
      msgId: "mock-msg-02",
      fromId: "mock-user-02",
      fromNickname: "Bob (test)",
      fromColor: "#8800AA",
      content: "Test message 2",
      timestamp: Date.now() - 30000,
    },
  ];
}
