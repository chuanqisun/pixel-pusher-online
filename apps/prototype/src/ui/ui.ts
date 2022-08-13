import { View } from "./view";

async function main() {
  const view = new View(document);

  view.navTabs.addEventListener("click", (e) => {
    const sectionName = (e.target as HTMLElement).closest("[data-target-section]")?.getAttribute("data-target-section");
    if (sectionName) {
      const sections = [...document.querySelectorAll("[data-section]")];
      sections.forEach((section) => section.classList.toggle("active", section.getAttribute("data-section") === sectionName));
    }
  });

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
    const message = { pluginMessage: { dir } };
    parent.postMessage(message, "*");
  });

  document.getElementById("avatar-selector")!.onclick = (e) => {
    const setAvatar = (e.target as HTMLElement)!.closest("[data-set-avatar]")?.getAttribute("data-set-avatar");
    if (!setAvatar) return;
    const message = { pluginMessage: { setAvatar } };
    parent.postMessage(message, "*");
  };

  document.getElementById("focus-character")!.onclick = () => {
    const message = { pluginMessage: { focusCharacter: true } };
    parent.postMessage(message, "*");
  };

  document.getElementById("emote")!.onclick = (e) => {
    const emote = (e.target as HTMLElement)!.closest("button")?.textContent;
    if (!emote) return;
    const message = { pluginMessage: { emote } };
    parent.postMessage(message, "*");
  };

  document.getElementById("name-form")!.onsubmit = (e) => {
    e.preventDefault();

    if ((e.target as HTMLFormElement).checkValidity()) {
      const nickname = new FormData(e.target as HTMLFormElement).get("nickname") as string;
      const message = { pluginMessage: { setNickname: nickname } };
      parent.postMessage(message, "*");
    }
  };

  window.focus();
}

main();
