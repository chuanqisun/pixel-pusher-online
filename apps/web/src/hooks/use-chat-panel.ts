import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { HistoryMessage } from "types";
import { useInterval } from "./use-interval";

export const BACKGROUND_POLL_INTERVAL = 5000;
export const ACTIVE_POLL_INTERVAL = 1000;

export interface UseChatProps {
  sendToMain: (message: any) => any;
  isActive: boolean;
}

export function useChatPanel({ sendToMain, isActive }: UseChatProps) {
  const handleChatKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Enter" && !e.shiftKey && !e.ctrlKey) {
      const textarea = e.target as HTMLTextAreaElement;

      const message = textarea.value.trim();
      if (!message.length) {
        e.stopPropagation(); // prevent other handlers
        e.preventDefault();
        return;
      }

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
  const [isUnread, setIsUnread] = useState(false);

  useInterval(
    () => {
      sendToMain({ getHistoryMessages: { lastId } });
    },
    isActive ? ACTIVE_POLL_INTERVAL : BACKGROUND_POLL_INTERVAL
  );
  // fetch initial message
  useEffect(() => {
    sendToMain({ getHistoryMessages: { lastId } });
  }, []);

  const chatMessagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    (chatMessagesRef.current?.lastChild as HTMLElement)?.scrollIntoView();
    if (!isActive && lastId) {
      setIsUnread(true);
    }
  }, [lastId]);

  const chatBoxRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (isActive) {
      chatBoxRef?.current?.focus();
      setIsUnread(false);
    }
  }, [isActive]);

  return {
    chatBoxRef,
    chatMessages,
    chatMessagesRef,
    handleChatKeyDown,
    setChatMessages,
    isUnread,
  };
}
