import { tones } from "./audio";

async function main() {
  document.getElementById("arrow-keys")!.onclick = (e) => {
    const dir = (e.target as HTMLElement)!.closest("[data-direction]")?.getAttribute("data-direction");
    if (!dir) return;
    const message = { pluginMessage: { dir } };
    parent.postMessage(message, "*");
  };

  document.addEventListener("keydown", (e) => {
    const dir = (() => {
      switch (e.code) {
        case "KeyA":
        case "ArrowLeft":
          return "w";
        case "KeyD":
        case "ArrowRight":
          return "e";
        case "KeyW":
        case "ArrowUp":
          return "n";
        case "KeyS":
        case "ArrowDown":
          return "s";
      }
    })();

    if (!dir) return;
    const message = { pluginMessage: { dir } };
    parent.postMessage(message, "*");
  });

  document.getElementById("play-sound")!.onclick = () => tones.play("c", 4);

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

  window.focus();
}

main();
