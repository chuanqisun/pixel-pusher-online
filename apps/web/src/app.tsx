import type { PrebuiltMap } from "assets/src/interface";
import { Fragment } from "preact";
import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { HistoryMessage, MessageToMain, MessageToUI } from "types";
import { avatars } from "./data/avatars";
import { maps } from "./data/maps";
import { AvatarController, getAvatarController } from "./utils/avatar-controller";
import { sendMessage } from "./utils/ipc";
import { throttle } from "./utils/throttle";
import { getAvatarScale, getDisplayFrame, getFrameCss, getStaticDemoFrame } from "./utils/transform";

export const CHAT_POLLING_INTERVAL = 1000;
const DEBUG = false;

const allAvatars = Object.entries(avatars);
const allMaps = Object.entries(maps);

export function App() {
  const storedNickname = useMemo(() => localStorage.getItem("nickname") ?? "", []);
  const storedAvatarId = useMemo(() => localStorage.getItem("avatarId") ?? allAvatars[0][0], []);

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
      const pluginMessage = e.data.pluginMessage as MessageToUI;
      console.log(`[ipc] Main -> UI`, pluginMessage);
      if (pluginMessage.defaultNickname) {
        setNickname((prevNickname) => (prevNickname?.length ? prevNickname : pluginMessage.defaultNickname!));
        localStorage.setItem("nickname", pluginMessage.defaultNickname);
      }

      if (pluginMessage.reset) {
        localStorage.clear();
        location.reload();
      }

      if (pluginMessage.historyMessages) {
        setChatMessages(pluginMessage.historyMessages);
      }
    };

    window.addEventListener("message", handleMainMessage);

    return () => window.removeEventListener("message", handleMainMessage);
  }, []);

  const handleNickname = useCallback((nickname: string) => {
    const normalized = nickname.trim();
    setNickname(normalized);
    localStorage.setItem("nickname", normalized);
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
    sendToMain({ imgUrl: avatars[selectedAvatarId].imgUrl });
  }, [selectedAvatarId]);

  const avatarController = useMemo(
    () => getAvatarController(avatars[selectedAvatarId], (change) => sendToMain({ ...change } as MessageToMain)),
    [selectedAvatarId]
  );

  useEffect(() => {
    avatarController.idle();
  }, [avatarController]);

  useKeyboardEvents(avatarController);

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
    sendToMain({ findMyself: true });
  }, []);

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
  const lastId = useMemo(() => chatMessages[chatMessages.length - 1]?.msgId, [chatMessages]);

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

  const handleSelectMap = useCallback((selectedMap: PrebuiltMap) => {
    sendToMain({ map: selectedMap });
  }, []);

  return (
    <>
      <nav id="nav-tabs" class="nav-tabs" onClick={handleNavTabClick}>
        <button class="u-bdr-2 u-fs-24" data-target-section="character">
          Me
        </button>
        <button class="u-bdr-2 u-fs-24" data-target-section="chat">
          Chat
        </button>
        <button class="u-bdr-2 u-fs-24" data-target-section="map">
          Map
        </button>
        <button class="u-bdr-2 u-fs-24" data-target-section="help">
          Info
        </button>
      </nav>

      <section class="app-layout__main nav-section active" data-section="character">
        <h2>Name</h2>
        <input
          class="u-bdr-2 u-pad-8 u-fs-16"
          name="nickname"
          type="text"
          required
          value={nickname}
          maxLength={24}
          onInput={(e) => handleNickname((e.target as HTMLInputElement).value)}
        />
        <button onClick={handleFindMyself}>Locate</button>
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
              <div style={activeDemoFrame && activeDemoAvatarId === id ? activeDemoFrame : getStaticDemoFrame(getAvatarScale(atlas.tileSize), atlas)}></div>
            </button>
          ))}
        </div>
      </section>

      <section class="app-layout__main nav-section chat-layout" data-section="chat">
        <div class="chat-layout__messages" ref={chatMessagesRef}>
          {chatMessages.map((chatMessage) => (
            <article key={chatMessage.msgId}>
              <div class="message-meta">
                <span class="message-meta__sender" style={{ backgroundColor: chatMessage.fromColor, color: "white" }}>
                  {chatMessage.fromNickname}
                </span>
                <time class="message-meta__time">{new Date(chatMessage.timestamp).toLocaleTimeString()}</time>
              </div>
              <p class="message-body">{chatMessage.content}</p>
            </article>
          ))}
        </div>
        <textarea
          maxLength={255}
          spellcheck={false}
          rows={3}
          class="u-bdr-2 u-pad-8 u-fs-16 chat-layout__text-box"
          placeholder='Press "ENTER" to send'
          onKeyDown={handleChatKeyDown}
        ></textarea>
      </section>

      <section class="app-layout__main nav-section maps-layout" data-section="map">
        {allMaps.map(([mapKey, mapData]) => (
          <div class="map-item" key={mapKey}>
            <details>
              <summary>{mapData.name}</summary>
              <dl class="metadata-list">
                {mapData.details.map((item) => (
                  <Fragment key={item.key}>
                    <dt>{item.key}</dt>

                    <dd>
                      {item.link ? (
                        <a href={item.link} target="_blank">
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </Fragment>
                ))}
              </dl>
            </details>
            <button class="u-pad-0 u-bdr-0 map-preview" onClick={() => handleSelectMap(mapData)}>
              <img class="map-preview__image" src={mapData.imgUrl}></img>
            </button>
          </div>
        ))}
      </section>
    </>
  );
}

function useKeyboardEvents(controller: AvatarController) {
  useEffect(() => {
    const keydownListener = throttle((e: KeyboardEvent) => {
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
    }, 100);

    document.addEventListener("keydown", keydownListener);

    return () => {
      document.removeEventListener("keydown", keydownListener);
    };
  }, [controller]);
}
