import type { HistoryMessage, MessageToMain, MessageToUI } from "types";

export default {};
console.log("[debug-shim] ready");

const mockMainState = {
  historyMessages: getMockHistory(),
  allowPolling: false,
};

window.addEventListener("message", (e) => {
  const message = e.data?.pluginMessage as MessageToMain;
  if (!mockMainState.allowPolling && message.getHistoryMessages) {
    // don't log
  } else {
    console.log(`[debug] UI -> Main`, message);
  }

  const pluginMessage = e.data?.pluginMessage as MessageToMain;

  if (pluginMessage.getHistoryMessages) {
    mockMainState.allowPolling &&
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
  const target = (e.target as HTMLElement).closest("[data-action]");
  const action = target?.closest("[data-action]")?.getAttribute("data-action");

  switch (action) {
    case "allow-polling":
      console.log(target);
      mockMainState.allowPolling = target!.querySelector("input")!.checked;
      break;
    case "reset":
      sendMessageFromMockMain({ reset: true });
      break;
    case "init-nickname":
      sendMessageFromMockMain({ defaultNickname: "Test user" });
      break;
    case "receive-message":
      mockMainState.historyMessages = [...mockMainState.historyMessages, getMockMessage()];
      break;
    case "clear-chat-history":
      mockMainState.historyMessages = [];
      sendMessageFromMockMain({
        historyMessages: mockMainState.historyMessages,
      });
      break;
    case "request-map":
      sendMessageFromMockMain({
        requestMap: true,
      });
      break;
  }
});

function sendMessageFromMockMain(message: MessageToUI) {
  document.querySelector("iframe")!.contentWindow!.postMessage({ pluginMessage: message }, "*");
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

let mockMessageSeq = 0;
function getMockMessage() {
  return {
    msgId: `mock-msg-id-${mockMessageSeq++}`,
    fromId: "mock-user-03",
    fromNickname: "Bot (test)",
    fromColor: "#333333",
    content: `Test message ${Date.now()}`,
    timestamp: Date.now(),
  };
}
