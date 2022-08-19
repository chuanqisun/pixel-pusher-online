import { Fragment } from "preact";
import { useCallback, useEffect } from "preact/hooks";
import type { MessageToUI } from "types";
import crosshair from "./assets/crosshair.svg";
import { useChatPanel } from "./hooks/use-chat-panel";
import { useKeyboardControl } from "./hooks/use-keyboard-control";
import { useMapPanel } from "./hooks/use-map-panel";
import { useMePanel } from "./hooks/use-me-panel";
import { useTabs } from "./hooks/use-tabs";
import { sendMessage } from "./utils/ipc";
import { getAvatarScale, getStaticDemoFrame } from "./utils/transform";

const links = {
  submitAvatar: "https://github.com/chuanqisun/pixel-pusher-online#avatar-design-requirement",
  submitMap: "https://github.com/chuanqisun/pixel-pusher-online#map-design-requirement",
  license: "https://github.com/chuanqisun/pixel-pusher-online#licenses-and-credits",
  issue: "https://github.com/chuanqisun/pixel-pusher-online/issues",
};

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

  const {
    setChatMessages,
    sentinelRef: bottomSentinelRef,
    chatBoxRef,
    chatMessagesRef,
    chatMessages,
    isUnread,
    handleChatKeyDown,
  } = useChatPanel({
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
            <img src={crosshair} alt="" />
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
          <a class="u-bg-accent-ll u-fg-accent-d character-submit-design" href={links.submitAvatar} target="_blank">
            Submit your avatar
          </a>
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
          <div ref={bottomSentinelRef}></div>
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
        <a class="u-bg-accent-l u-fg-accent-dd map-submit-design" href={links.submitMap} target="_blank">
          Submit your map
        </a>
      </section>
      <section class="app-layout__main nav-section info-layout" data-active={activeTab === "info"}>
        <article class="info-card">
          <h2>Quickstart</h2>
          <ul>
            <li>Run widget to start</li>
            <li>Close widget to pause</li>
            <li>Click avatar or run widget again to resume</li>
          </ul>
        </article>
        <article class="info-card">
          <h2>Control</h2>
          <ul>
            <li>
              <kbd class="u-bdr-2 u-bg-accent-ll">W</kbd> <kbd class="u-bdr-2 u-bg-accent-ll">A</kbd> <kbd class="u-bdr-2 u-bg-accent-ll">S</kbd>{" "}
              <kbd class="u-bdr-2 u-bg-accent-ll">D</kbd> to walk, or
            </li>
            <li>
              <kbd class="u-bdr-2 u-bg-accent-ll">↑</kbd> <kbd class="u-bdr-2 u-bg-accent-ll">←</kbd> <kbd class="u-bdr-2 u-bg-accent-ll">↓</kbd>{" "}
              <kbd class="u-bdr-2 u-bg-accent-ll">→</kbd> to walk
            </li>
          </ul>
        </article>
        <article class="info-card">
          <h2>Chat</h2>
          <ul>
            <li>History stored in page</li>
            <li>Delete page to clear history</li>
            <li>128 messages per file</li>
          </ul>
        </article>
        <article class="info-card">
          <h2>Map</h2>
          <ul>
            <li>One map per file</li>
            <li>Avatar respawn when map changes</li>
          </ul>
        </article>
        <article class="info-card">
          <h2>Contribute</h2>
          <ul>
            <li>
              <a class="u-fg-accent-dd" href={links.submitAvatar} target="_blank">
                Submit your avatar
              </a>
            </li>
            <li>
              <a class="u-fg-accent-dd" href={links.submitMap} target="_blank">
                Submit your map
              </a>
            </li>
            <li>
              <a class="u-fg-accent-dd" href={links.issue} target="_blank">
                Issues and feedback
              </a>
            </li>
          </ul>
        </article>
        <article class="info-card">
          <h2>Licenses and Credits</h2>
          <ul>
            <li>
              <a class="u-fg-accent-dd" href={links.license} target="_blank">
                View details on GitHub
              </a>
            </li>
          </ul>
        </article>
      </section>
    </>
  );
}
