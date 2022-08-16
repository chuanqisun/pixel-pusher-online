import { useEffect } from "preact/hooks";
import type { AvatarController } from "../utils/avatar-controller";
import { throttle } from "../utils/throttle";

export function useKeyboardControl(controller: AvatarController) {
  useEffect(() => {
    const keydownListener = throttle((e: KeyboardEvent) => {
      const dir = (() => {
        if ((e.target as HTMLElement).matches("input,textarea")) return;

        switch (e.code) {
          case "KeyA":
          case "ArrowLeft":
            e.preventDefault();
            e.stopPropagation();
            return "W";
          case "KeyD":
          case "ArrowRight":
            e.preventDefault();
            e.stopPropagation();
            return "E";
          case "KeyW":
          case "ArrowUp":
            e.preventDefault();
            e.stopPropagation();
            return "N";
          case "KeyS":
          case "ArrowDown":
            e.preventDefault();
            e.stopPropagation();
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
