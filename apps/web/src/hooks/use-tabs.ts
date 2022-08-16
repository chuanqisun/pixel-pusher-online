import { useCallback, useState } from "preact/hooks";

export function useTabs() {
  const [activeTab, setActiveTab] = useState("me");

  const handleNavTabClick = useCallback((e: Event) => {
    const targetTab = (e.target as HTMLElement).closest("[data-target-tab]")?.getAttribute("data-target-tab");
    if (targetTab) {
      setActiveTab(targetTab);
    }
  }, []);

  return { activeTab, handleNavTabClick };
}
