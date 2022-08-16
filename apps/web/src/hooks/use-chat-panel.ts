import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { HistoryMessage } from "types";
import { useInterval } from "./use-interval";

export const BACKGROUND_POLL_INTERVAL = 3000;
export const ACTIVE_POLL_INTERVAL = 500;
export interface UseChatProps {
  sendToMain: (message: any) => any;
  isActive: boolean;
}

export function useChatPanel({ sendToMain, isActive }: UseChatProps) {
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

  useInterval(
    () => {
      sendToMain({ getHistoryMessages: { lastId } });
    },
    isActive ? ACTIVE_POLL_INTERVAL : BACKGROUND_POLL_INTERVAL
  );

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
