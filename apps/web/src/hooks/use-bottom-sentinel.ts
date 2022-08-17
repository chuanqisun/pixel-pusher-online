import { useEffect, useRef, useState } from "preact/hooks";

export function useBottomSentinel() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      setIsAtBottom(entries[0].isIntersecting);
    });

    if (!sentinelRef.current) return;

    observer.observe(sentinelRef.current);
    console.log(`[chat] observing bottom sentinel`);

    return () => observer.disconnect();
  }, []);

  return {
    sentinelRef,
    isAtBottom,
  };
}
