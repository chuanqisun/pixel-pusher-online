import { Fragment } from "preact";
import { useCallback, useEffect } from "preact/hooks";
import type { MessageToUI } from "types";
import { useChatPanel } from "./hooks/use-chat-panel";
import { useKeyboardControl } from "./hooks/use-keyboard-control";
import { useMapPanel } from "./hooks/use-map-panel";
import { useMePanel } from "./hooks/use-me-panel";
import { useTabs } from "./hooks/use-tabs";
import { sendMessage } from "./utils/ipc";
import { getAvatarScale, getStaticDemoFrame } from "./utils/transform";

export function App() {
  const sendToMain = useCallback(sendMessage.bind(null, import.meta.env.VITE_IFRAME_HOST_ORIGIN, import.meta.env.VITE_PLUGIN_ID), []);

  const { activeTab, handleNavTabClick } = useTabs();

  const {
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
  } = useMePanel({ sendToMain });

  useKeyboardControl(avatarController);

  const { setChatMessages, chatBoxRef, chatMessagesRef, chatMessages, isUnread, handleChatKeyDown } = useChatPanel({
    sendToMain,
    isActive: activeTab === "chat",
  });

  const { allMaps, handleSelectMap } = useMapPanel({ sendToMain });

  useEffect(() => {
    const handleMainMessage = (e: MessageEvent) => {
      const pluginMessage = e.data.pluginMessage as MessageToUI;
      console.log(`[ipc] Main -> UI`, pluginMessage);

      if (pluginMessage.reset) {
        localStorage.clear();
        location.reload();
      }

      if (pluginMessage.defaultNickname) {
        handleDefaultNickname(pluginMessage.defaultNickname);
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

  return (
    <>
      <nav id="nav-tabs" class="u-bg-bk nav-tabs" onClick={handleNavTabClick}>
        <button class="u-bdr-0 u-bg-accent u-hover-bg-accent-l u-active-bg-accent-ll nav-button" data-active={activeTab === "me"} data-target-tab="me">
          Me
        </button>
        <button class="u-bdr-0 u-bg-accent u-hover-bg-accent-l u-active-bg-accent-ll nav-button" data-active={activeTab === "chat"} data-target-tab="chat">
          {isUnread ? "*" : ""}Chat
        </button>
        <button class="u-bdr-0 u-bg-accent u-hover-bg-accent-l u-active-bg-accent-ll nav-button" data-active={activeTab === "map"} data-target-tab="map">
          Map
        </button>
        <button class="u-bdr-0 u-bg-accent u-hover-bg-accent-l u-active-bg-accent-ll nav-button" data-active={activeTab === "info"} data-target-tab="info">
          Info
        </button>
      </nav>

      <section class="u-bg-accent-ll app-layout__main nav-section character-layout active" data-active={activeTab === "me"}>
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
          <button class="u-bdr-2 u-bg-accent u-hover-bg-accent-l u-active-bg-accent-ll name-setup__locator" title="Find my avatar" onClick={handleFindMyself}>
            ⌖
          </button>
        </div>
        <div class="character-list u-bg-bk character-layout__scroll">
          {allAvatars.map(([id, atlas]) => (
            <div class="u-bg-accent-ll character-item" key={id}>
              <button
                class="u-bdr-0 u-bg-accent u-active-bg-accent-l character-button"
                title="Click to select"
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

      <section class="app-layout__main nav-section chat-layout" data-active={activeTab === "chat"}>
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
          ref={chatBoxRef}
          maxLength={255}
          spellcheck={false}
          rows={3}
          class="u-pad-8 u-bg-accent-ll u-hover-bg-wt u-focus-bg-wt chat-layout__text-box"
          placeholder='Press "ENTER" to send'
          onKeyDown={handleChatKeyDown}
        ></textarea>
      </section>

      <section class="app-layout__main nav-section maps-layout" data-active={activeTab === "map"}>
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
            <button class="u-pad-0 u-bdr-0 map-preview" title="Click to select" onClick={() => handleSelectMap(mapKey, mapData)}>
              <img class="map-preview__image" src={mapData.imgUrl}></img>
            </button>
          </div>
        ))}
      </section>
    </>
  );
}
