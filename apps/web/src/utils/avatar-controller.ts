import type { Atlas, Frame } from "assets";

export type Pose = "idle" | "walk";
export type Direction = "N" | "E" | "S" | "W";

export interface AvatarController {
  step(dir: Direction): any;
  idle(): any;
}

export function getAvatarController(atlas: Atlas, onFrame: (frame: Frame) => any): AvatarController {
  let frameIndex = 0;
  let currentDir: Direction = "S";
  let currentPose = "idle";
  let frames = atlas.animations["idleS"];

  const getFrames = () => atlas.animations[`${currentPose}${currentDir}`];

  const step = (newDir: Direction) => {
    if (newDir !== currentDir) {
      frameIndex = 0;
      currentPose = "idle";
      currentDir = newDir;
      frames = getFrames();
    } else if (currentPose === "idle") {
      frameIndex = 0;
      currentPose = "walk";
      frames = getFrames();
    } else {
      frameIndex = (frameIndex + 1) % frames.length;
    }

    onFrame(getFrames()[frameIndex]);
  };

  const idle = () => {
    frameIndex = 0;
    currentPose = "idle";

    onFrame(getFrames()[frameIndex]);
  };

  return {
    idle,
    step,
  };
}
