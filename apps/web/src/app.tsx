import type { PrebuiltMap } from "assets/src/interface";
import { Fragment } from "preact";
import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { HistoryMessage, MessageToUI } from "types";
import { maps } from "./data/maps";
import { useMePanel } from "./hooks/use-me-panel";
import type { AvatarController } from "./utils/avatar-controller";
import { sendMessage } from "./utils/ipc";
import { throttle } from "./utils/throttle";
import { getAvatarScale, getStaticDemoFrame } from "./utils/transform";

export const CHAT_POLLING_INTERVAL = 1000;

const allMaps = Object.entries(maps);

export function App() {
  const handleNavTabClick = useCallback((e: Event) => {
    const sectionName = (e.target as HTMLElement).closest("[data-target-section]")?.getAttribute("data-target-section");
    if (sectionName) {
      const sections = [...document.querySelectorAll("[data-section]")];
      sections.forEach((section) => section.classList.toggle("active", section.getAttribute("data-section") === sectionName));
    }
  }, []);

  const sendToMain = useCallback(sendMessage.bind(null, import.meta.env.VITE_IFRAME_HOST_ORIGIN, import.meta.env.VITE_PLUGIN_ID), []);

  const {
    activeDemoAvatarId,
    activeDemoFrame,
    allAvatars,
    avatarController,
    handleFindMyself,
    handleNickname,
    handleSelectAvatar,
    nickname,
    selectedAvatarId,
    setDemoAvatarId,
    setNickname,
  } = useMePanel({ sendToMain });

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

      if (pluginMessage.requestMap) {
        handleSelectMap(...allMaps[0]);
      }
    };

    window.addEventListener("message", handleMainMessage);

    return () => window.removeEventListener("message", handleMainMessage);
  }, []);

  useKeyboardEvents(avatarController);

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

  const handleSelectMap = useCallback((key: string, selectedMap: PrebuiltMap) => {
    function dataUriToBytes(uri: string) {
      const byteString = window.atob(uri.split(",")[1]);
      const bytes = new Uint8Array(new ArrayBuffer(byteString.length));

      for (let i = 0; i < byteString.length; i++) {
        bytes[i] = byteString.charCodeAt(i);
      }

      return bytes;
    }

    sendToMain({
      map: {
        key,
        name: selectedMap.name,
        imageBytes: dataUriToBytes(selectedMap.imgUrl),
        rows: selectedMap.rows,
        cols: selectedMap.cols,
        spawnTiles: selectedMap.spawnTiles,
      },
    });
  }, []);

  return (
    <>
      <nav id="nav-tabs" class="u-bg-bk nav-tabs" onClick={handleNavTabClick}>
        <button class="u-bdr-0 u-bg-accent u-hover-bg-accent-l u-active-bg-accent-ll nav-button" data-target-section="character">
          Me
        </button>
        <button class="u-bdr-0 u-bg-accent u-hover-bg-accent-l u-active-bg-accent-ll nav-button" data-target-section="chat">
          Chat
        </button>
        <button class="u-bdr-0 u-bg-accent u-hover-bg-accent-l u-active-bg-accent-ll nav-button" data-target-section="map">
          Map
        </button>
        <button class="u-bdr-0 u-bg-accent u-hover-bg-accent-l u-active-bg-accent-ll nav-button" data-target-section="help">
          Info
        </button>
      </nav>

      <section class="u-bg-accent-ll app-layout__main nav-section character-layout active" data-section="character">
        <div class="u-bg-accent-l name-setup character-layout__header">
          <input
            class="u-bdr-2 u-pad-8 u-bg-accent-ll u-hover-bg-wt u-focus-bg-wt name-setup__nickname"
            name="nickname"
            placeholder="Nickname"
            type="text"
            required
            value={nickname}
            spellcheck={false}
            maxLength={24}
            onInput={(e) => handleNickname((e.target as HTMLInputElement).value)}
          />
          <button class="u-bdr-2 u-bg-accent u-hover-bg-accent-l u-active-bg-accent-ll name-setup__locator" onClick={handleFindMyself}>
            ⌖
          </button>
        </div>
        <div class="character-list u-bg-bk character-layout__scroll">
          {allAvatars.map(([id, atlas]) => (
            <div class="u-bg-accent-ll character-item" key={id}>
              <button
                class="u-bdr-0 u-bg-accent u-active-bg-accent-l character-button"
                data-active={selectedAvatarId === id}
                onMouseEnter={() => setDemoAvatarId(id)}
                onfocusin={() => setDemoAvatarId(id)}
                onMouseLeave={() => setDemoAvatarId(null)}
                onfocusout={() => setDemoAvatarId(null)}
                onClick={() => handleSelectAvatar(id)}
              >
                <div style={activeDemoFrame && activeDemoAvatarId === id ? activeDemoFrame : getStaticDemoFrame(getAvatarScale(atlas.tileSize), atlas)}></div>
              </button>
              <p class="character-bio">
                <div>{atlas.name}</div>
                <dl class="character-details">
                  {atlas.details.map((item) => (
                    <div key={item.key}>
                      <dt>{item.key}: </dt>
                      <dd>
                        {item.link ? (
                          <a class="u-fg-accent-d" href={item.link} target="_blank">
                            {item.value}
                          </a>
                        ) : (
                          item.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </p>
            </div>
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
              <p class="u-bg-accent-ll message-body">{chatMessage.content}</p>
            </article>
          ))}
        </div>
        <textarea
          maxLength={255}
          spellcheck={false}
          rows={3}
          class="u-pad-8 u-bg-accent-ll u-hover-bg-wt u-focus-bg-wt chat-layout__text-box"
          placeholder='Press "ENTER" to send'
          onKeyDown={handleChatKeyDown}
        ></textarea>
      </section>

      <section class="app-layout__main nav-section maps-layout" data-section="map">
        {allMaps.map(([mapKey, mapData]) => (
          <div class="map-item" key={mapKey}>
            <details class="metadata-accordion">
              <summary>{mapData.name}</summary>
              <dl class="metadata-list">
                {mapData.details.map((item) => (
                  <div key={item.key}>
                    <dt>{item.key}:&nbsp;</dt>
                    <dd>
                      {item.link ? (
                        <a class="u-fg-accent-dd" href={item.link} target="_blank">
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </details>
            <button class="u-pad-0 u-bdr-0 map-preview" onClick={() => handleSelectMap(mapKey, mapData)}>
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
