import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { HistoryMessage } from "types";
import { CHAT_POLLING_INTERVAL } from "../app";

export interface UseChatProps {
  sendToMain: (message: any) => any;
}

export function useChatPanel({ sendToMain }: UseChatProps) {
  const handleChatKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Enter" && !e.shiftKey && !e.ctrlKey) {
      const textarea = e.target as HTMLTextAreaElement;
      sendToMain({
        newMessage: {
          content: textarea.value,
        },
      });
      e.stopPropagation(); // prevent other handlers
      e.preventDefault(); // prevent inserting a line break
      textarea.value = "";
    }
  }, []);

  const [chatMessages, setChatMessages] = useState<HistoryMessage[]>([]);
  const lastId = useMemo(() => chatMessages[chatMessages.length - 1]?.msgId ?? "", [chatMessages]);

  useEffect(() => {
    const timer = setInterval(() => {
      sendToMain({ getHistoryMessages: { lastId } });
    }, CHAT_POLLING_INTERVAL);

    return () => clearInterval(timer);
  }, [lastId]);

  const chatMessagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    (chatMessagesRef.current?.lastChild as HTMLElement)?.scrollIntoView();
  }, [lastId]);

  return {
    setChatMessages,
    chatMessagesRef,
    chatMessages,
    handleChatKeyDown,
  };
}
