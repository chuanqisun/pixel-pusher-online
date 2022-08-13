import { useCallback, useEffect, useState } from "preact/hooks";
import { sendMessage } from "./utils/ipc";

import type { Atlas, Frame } from "assets";
import { avatars } from "./data/avatars";

const allAvatars = Object.entries(avatars);

export function App() {
  const sendToMain = useCallback(sendMessage.bind(null, import.meta.env.VITE_IFRAME_HOST_ORIGIN, import.meta.env.VITE_PLUGIN_ID), []);

  const handleNavTabClick = useCallback((e: Event) => {
    const sectionName = (e.target as HTMLElement).closest("[data-target-section]")?.getAttribute("data-target-section");
    if (sectionName) {
      const sections = [...document.querySelectorAll("[data-section]")];
      sections.forEach((section) => section.classList.toggle("active", section.getAttribute("data-section") === sectionName));
    }
  }, []);

  const handleSelectAvatar = useCallback((id: string) => {
    sendToMain({ setAvatar: avatars[id] });
  }, []);

  useEventHanlders(sendToMain);

  const [activeDemoAvatarId, setDemoAvatarId] = useState<string | null>(null);
  useEffect(() => {
    if (activeDemoAvatarId === null) {
      setDemoFrame(null);
      return;
    }
    const activeAtlas = avatars[activeDemoAvatarId];
    const demoAnimations = ["walkS", "walkW", "walkN", "walkE"];
    const allFrames = demoAnimations.map((animationName) => activeAtlas.animations[animationName]).flat();
    let i = 0;
    const timer = setInterval(() => {
      setDemoFrame(getFrameCss(getDisplayFrame(activeAtlas, allFrames[i])));
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
        <button class="nav-button" data-target-section="emote">
          🎭
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
          <form id="name-form" class="name-form">
            <input name="nickname" type="text" required />
            <button type="submit">Change</button>
          </form>
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
                <div style={activeDemoFrame && activeDemoAvatarId === id ? activeDemoFrame : getStaticDemoFrame(atlas)}></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section class="nav-section" data-section="emote">
        <h1>Emote</h1>
        <div id="emote">
          <button>👋</button>
          <button>😆</button>
          <button>👍</button>
          <button>💩</button>
          <button>Clear</button>
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

function useEventHanlders(sendToMain: (message: any) => any) {
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      const dir = (() => {
        if ((e.target as HTMLElement).matches("input,textarea")) return;

        switch (e.code) {
          case "KeyA":
          case "ArrowLeft":
            e.preventDefault();
            return "w";
          case "KeyD":
          case "ArrowRight":
            e.preventDefault();
            return "e";
          case "KeyW":
          case "ArrowUp":
            e.preventDefault();
            return "n";
          case "KeyS":
          case "ArrowDown":
            e.preventDefault();
            return "s";
        }
      })();

      if (!dir) return;
      const message = { dir };
      sendToMain(message);
    });

    // document.getElementById("avatar-selector")!.onclick = (e) => {
    //   const setAvatar = (e.target as HTMLElement)!.closest("[data-set-avatar]")?.getAttribute("data-set-avatar");
    //   if (!setAvatar) return;
    //   const message = { setAvatar };
    //   sendToMain(message);
    // };

    document.getElementById("focus-character")!.onclick = () => {
      const message = { focusCharacter: true };
      sendToMain(message);
    };

    document.getElementById("emote")!.onclick = (e) => {
      const emote = (e.target as HTMLElement)!.closest("button")?.textContent;
      if (!emote) return;
      const message = { emote };
      sendToMain(message);
    };

    document.getElementById("name-form")!.onsubmit = (e) => {
      e.preventDefault();

      if ((e.target as HTMLFormElement).checkValidity()) {
        const nickname = new FormData(e.target as HTMLFormElement).get("nickname") as string;
        const message = { setNickname: nickname };
        sendToMain(message);
      }
    };
  }, []);
}

function getDisplayFrame(atlas: Atlas, frame: Frame) {
  const { col, row, transform } = frame;
  const size = atlas.cellSize;
  const x = size * col;
  const y = size * row;
  const url = atlas.imgUrl;

  return { x, y, transform, url, size };
}

function getFrameCss({ url, x, y, size, transform }: { url: string; x: number; y: number; size: number; transform?: number[] }) {
  return {
    transform: transform ? `matrix(${transform.join(", ")})` : undefined,
    width: size,
    height: size,
    backgroundImage: `url("${url}")`,
    backgroundPosition: `-${x}px -${y}px`,
  };
}

function getStaticDemoFrame(atlas: Atlas) {
  return getFrameCss(getDisplayFrame(atlas, atlas.animations.idleS[0]));
}
