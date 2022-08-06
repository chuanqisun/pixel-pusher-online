import { tones } from "./audio";

async function main() {
  document.getElementById("arrow-keys")!.onclick = (e) => {
    const dir = (e.target as HTMLElement)!.closest("[data-direction]")!.getAttribute("data-direction");
    console.log(dir);
    const message = { pluginMessage: { dir } };
    parent.postMessage(message, "*");
  };

  document.addEventListener("keydown", (e) => {
    const dir = (() => {
      switch (e.code) {
        case "KeyA":
        case "ArrowLeft":
          return "left";
        case "KeyD":
        case "ArrowRight":
          return "right";
        case "KeyW":
        case "ArrowUp":
          return "up";
        case "KeyS":
        case "ArrowDown":
          return "down";
      }
    })();

    if (!dir) return;
    const message = { pluginMessage: { dir } };
    parent.postMessage(message, "*");
  });

  document.getElementById("play-sound")!.onclick = () => tones.play("c", 4);
}

main();
