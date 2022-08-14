import type { HistoryMessage, MessageToMain, MessageToUI } from "types";

export default {};
console.log("[debug-shim] ready");

const mockMainState = {
  historyMessages: getMockHistory(),
};

window.addEventListener("message", (e) => {
  console.log(e.data?.pluginMessage);

  const pluginMessage = e.data?.pluginMessage as MessageToMain;

  if (pluginMessage.getHistoryMessages) {
    sendMessageFromMockMain({
      historyMessages: mockMainState.historyMessages,
    });
  }

  if (pluginMessage.newMessage) {
    mockMainState.historyMessages.push({
      msgId: `${Date.now()}`,
      fromId: "1",
      fromNickname: "Test user",
      fromColor: "#8800AA",
      timestamp: Date.now(),
      content: pluginMessage.newMessage.content,
    });
    sendMessageFromMockMain({
      historyMessages: mockMainState.historyMessages,
    });
  }
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
      mockMainState.historyMessages = [];
      sendMessageFromMockMain({
        historyMessages: mockMainState.historyMessages,
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
