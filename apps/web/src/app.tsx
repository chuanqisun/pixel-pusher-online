import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { sendMessage } from "./utils/ipc";

import { avatars } from "./data/avatars";
import { AvatarController, getAvatarController } from "./utils/avatar-controller";
import { getAvatarScale, getDisplayFrame, getFrameCss, getStaticDemoFrame } from "./utils/transform";

export const AVATAR_SIZE = 32;
const allAvatars = Object.entries(avatars);

export function App() {
  const storedNickname = useMemo(() => localStorage.getItem("nickname") ?? "", []);
  const storedAvatarId = useMemo(() => localStorage.getItem("avatarId") ?? "alec", []);

  const sendToMain = useCallback(sendMessage.bind(null, import.meta.env.VITE_IFRAME_HOST_ORIGIN, import.meta.env.VITE_PLUGIN_ID), []);

  const handleNavTabClick = useCallback((e: Event) => {
    const sectionName = (e.target as HTMLElement).closest("[data-target-section]")?.getAttribute("data-target-section");
    if (sectionName) {
      const sections = [...document.querySelectorAll("[data-section]")];
      sections.forEach((section) => section.classList.toggle("active", section.getAttribute("data-section") === sectionName));
    }
  }, []);

  const [nickname, setNickname] = useState(storedNickname);

  useEffect(() => {
    const handleMainMessage = (e: MessageEvent) => {
      const { pluginMessage } = e.data;
      console.log(`[ipc] received from main`, e.data.pluginMessage);
      if (pluginMessage.defaultNickname && !storedNickname.length) {
        setNickname(pluginMessage.defaultNickname);
        localStorage.setItem("nickname", pluginMessage.defaultNickname);
      }
    };

    window.addEventListener("message", handleMainMessage);

    return () => window.removeEventListener("message", handleMainMessage);
  }, []);

  const handleNickname = useCallback((nickname: string) => {
    const normalized = nickname.trim();
    if (normalized) {
      localStorage.setItem("nickname", normalized);
      console.log("setting", normalized);
      setNickname(normalized);
    }
  }, []);

  useEffect(() => {
    sendToMain({ setNickname: nickname });
  }, [nickname]);

  const [selectedAvatarId, setSelectedAvatarId] = useState(storedAvatarId);

  const handleSelectAvatar = useCallback((id: string) => {
    setSelectedAvatarId(id);
  }, []);

  useEffect(() => {
    sendToMain({ setAvatar: avatars[selectedAvatarId] });
  }, [selectedAvatarId]);

  const avatarcontroller = useMemo(
    () =>
      getAvatarController(
        avatars[selectedAvatarId],
        (frame) => sendToMain({ frame }),
        (move) => sendToMain({ move })
      ),
    [selectedAvatarId]
  );

  useEffect(() => {
    avatarcontroller.idle();
  }, [avatarcontroller]);

  useKeyboardEvents(avatarcontroller);

  const [activeDemoAvatarId, setDemoAvatarId] = useState<string | null>(null);
  useEffect(() => {
    if (activeDemoAvatarId === null) {
      setDemoFrame(null);
      return;
    }
    const activeAtlas = avatars[activeDemoAvatarId];
    const demoAnimations = ["walkS", "walkW", "walkN", "walkE"];
    const allFrames = demoAnimations.map((animationName) => activeAtlas.animations[animationName]).flat();
    const scale = getAvatarScale(activeAtlas.cellSize);
    let i = 0;
    const timer = setInterval(() => {
      setDemoFrame(getFrameCss(getDisplayFrame(scale, activeAtlas, allFrames[i])));
      i = (i + 1) % allFrames.length;
    }, 200);

    return () => clearInterval(timer);
  }, [activeDemoAvatarId]);
  const [activeDemoFrame, setDemoFrame] = useState<any>(null);

  return (
    <>
      <nav id="nav-tabs" class="nav-tabs" onClick={handleNavTabClick}>
        <button class="nav-button" data-target-section="character">
          🧑
        </button>
        <button class="nav-button" data-target-section="chat">
          💬
        </button>
        <button class="nav-button" data-target-section="map">
          🗺️
        </button>
        <button class="nav-button" data-target-section="help">
          📋
        </button>
      </nav>

      <section class="nav-section" data-section="character">
        <h1>Character</h1>
        <button id="focus-character">Locate myself</button>
        <div>
          <h2>Name</h2>
          <input name="nickname" type="text" required value={nickname} onInput={(e) => handleNickname((e.target as HTMLInputElement).value)} />
          <h2>Avatar</h2>
          <div class="character-grid">
            {allAvatars.map(([id, atlas]) => (
              <button
                class="character-button"
                key={id}
                onMouseEnter={() => setDemoAvatarId(id)}
                onMouseLeave={() => setDemoAvatarId(null)}
                onClick={() => handleSelectAvatar(id)}
              >
                <div style={activeDemoFrame && activeDemoAvatarId === id ? activeDemoFrame : getStaticDemoFrame(getAvatarScale(atlas.cellSize), atlas)}></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section class="nav-section" data-section="chat">
        <h1>Chat</h1>
        <textarea placeholder="Chat message"></textarea>
      </section>

      <section class="nav-section" data-section="map">
        <h1>Map</h1>
      </section>
    </>
  );
}

function useKeyboardEvents(controller: AvatarController) {
  useEffect(() => {
    const keydownListener = (e: KeyboardEvent) => {
      const dir = (() => {
        if ((e.target as HTMLElement).matches("input,textarea")) return;

        switch (e.code) {
          case "KeyA":
          case "ArrowLeft":
            e.preventDefault();
            return "W";
          case "KeyD":
          case "ArrowRight":
            e.preventDefault();
            return "E";
          case "KeyW":
          case "ArrowUp":
            e.preventDefault();
            return "N";
          case "KeyS":
          case "ArrowDown":
            e.preventDefault();
            return "S";
        }
      })();

      if (!dir) return;

      controller.step(dir);
    };

    document.addEventListener("keydown", keydownListener);

    return () => {
      document.removeEventListener("keydown", keydownListener);
    };
  }, [controller]);
}
