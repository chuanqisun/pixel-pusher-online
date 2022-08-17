import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import type { MessageToMain } from "types";
import { avatars } from "../data/avatars";
import { getAvatarController } from "../utils/avatar-controller";
import { getAvatarScale, getDisplayFrame, getFrameCss } from "../utils/transform";

export interface UseMePanelProps {
  sendToMain: (message: any) => any;
}

const allAvatars = Object.entries(avatars);

export function useMePanel({ sendToMain }: UseMePanelProps) {
  const storedNickname = useMemo(() => localStorage.getItem("nickname") ?? "", []);
  const storedAvatarId = useMemo(() => localStorage.getItem("avatarId") ?? allAvatars[0][0], []);

  const [nickname, setNickname] = useState(storedNickname);

  const handleNickname = useCallback((nickname: string) => {
    const normalized = nickname.trim();
    setNickname(normalized);
    localStorage.setItem("nickname", normalized);
  }, []);

  const handleDefaultNickname = useCallback((defaultNickname: string) => {
    setNickname((prevNickname) => {
      if (prevNickname?.length) {
        return prevNickname;
      } else {
        localStorage.setItem("nickname", defaultNickname);
        return defaultNickname;
      }
    });
  }, []);

  useEffect(() => {
    sendToMain({ nickname });
  }, [nickname]);

  const [selectedAvatarId, setSelectedAvatarId] = useState(storedAvatarId);

  const handleSelectAvatar = useCallback((id: string) => {
    localStorage.setItem("avatarId", id);
    setSelectedAvatarId(id);
  }, []);

  useEffect(() => {
    sendToMain({ avatarUrl: avatars[selectedAvatarId].imgUrl });
  }, [selectedAvatarId]);

  const avatarController = useMemo(
    () => getAvatarController(avatars[selectedAvatarId], (change) => sendToMain({ ...change } as MessageToMain)),
    [selectedAvatarId]
  );

  useEffect(() => {
    avatarController.idle();
  }, [avatarController]);

  const [activeDemoAvatarId, setDemoAvatarId] = useState<string | null>(null);
  useEffect(() => {
    if (activeDemoAvatarId === null) {
      setDemoFrame(null);
      return;
    }
    const activeAtlas = avatars[activeDemoAvatarId];
    const demoAnimations = ["walkS", "walkW", "walkN", "walkE"];
    const allFrames = demoAnimations.map((animationName) => activeAtlas.animations[animationName]).flat();
    const scale = getAvatarScale(activeAtlas.tileSize);
    let i = 0;
    const timer = setInterval(() => {
      setDemoFrame(getFrameCss(getDisplayFrame(scale, activeAtlas, allFrames[i])));
      i = (i + 1) % allFrames.length;
    }, 200);

    return () => clearInterval(timer);
  }, [activeDemoAvatarId]);
  const [activeDemoFrame, setDemoFrame] = useState<any>(null);

  const handleFindMyself = useCallback(() => {
    avatarController.idle();
    sendToMain({ findMyself: true });
  }, [avatarController]);

  return {
    activeDemoAvatarId,
    activeDemoFrame,
    allAvatars,
    avatarController,
    handleFindMyself,
    handleNickname,
    handleDefaultNickname,
    handleSelectAvatar,
    nickname,
    selectedAvatarId,
    setDemoAvatarId,
  };
}
