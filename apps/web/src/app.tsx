import { useCallback, useEffect } from "preact/hooks";
import { sendMessage } from "./utils/ipc";

export function App() {
  const sendToMain = useCallback(sendMessage.bind(null, import.meta.env.VITE_IFRAME_HOST_ORIGIN, import.meta.env.VITE_PLUGIN_ID), []);

  const handleNavTabClick = useCallback((e: Event) => {
    const sectionName = (e.target as HTMLElement).closest("[data-target-section]")?.getAttribute("data-target-section");
    if (sectionName) {
      const sections = [...document.querySelectorAll("[data-section]")];
      sections.forEach((section) => section.classList.toggle("active", section.getAttribute("data-section") === sectionName));
    }
  }, []);

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

    document.getElementById("avatar-selector")!.onclick = (e) => {
      const setAvatar = (e.target as HTMLElement)!.closest("[data-set-avatar]")?.getAttribute("data-set-avatar");
      if (!setAvatar) return;
      const message = { setAvatar };
      sendToMain(message);
    };

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
        <div>
          <h2>Name</h2>
          <form id="name-form" class="name-form">
            <input name="nickname" type="text" required />
            <button type="submit">Change</button>
          </form>
          <h2>Avatar</h2>
          <div>
            <span id="avatar-selector">
              <button data-set-avatar="prev">prev</button>
              <button data-set-avatar="next">next</button>
            </span>
            <button id="focus-character">center</button>
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
