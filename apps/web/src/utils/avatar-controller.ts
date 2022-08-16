import type { CharacterAtlas } from "assets";
import { getFigmaImageTransform } from "./transform";

export type Pose = "idle" | "walk";
export type Direction = "N" | "E" | "S" | "W";

export interface AvatarController {
  step(dir: Direction): any;
  idle(): any;
}

export interface AvatarChange {
  transform?: number[][];
  move?: Direction;
}

export function getAvatarController(atlas: CharacterAtlas, onChange: (change: AvatarChange) => any): AvatarController {
  let frameIndex = 0;
  let currentDir: Direction = "S";
  let currentPose = "idle";
  let frames = atlas.animations["idleS"];

  const getFigmaTransform = getFigmaImageTransform.bind(null, atlas);
  const getFrames = () => atlas.animations[`${currentPose}${currentDir}`];

  const step = (newDir: Direction) => {
    const change: AvatarChange = {};

    if (newDir !== currentDir) {
      frameIndex = 0;
      currentPose = "idle";
      currentDir = newDir;
      frames = getFrames();
    } else if (currentPose === "idle") {
      frameIndex = 0;
      currentPose = "walk";
      frames = getFrames();
      change.move = currentDir;
    } else {
      frameIndex = (frameIndex + 1) % frames.length;
      change.move = currentDir;
    }

    change.transform = getFigmaTransform(getFrames()[frameIndex]);

    onChange(change);
  };

  const idle = () => {
    frameIndex = 0;
    currentPose = "idle";
    currentDir = "S";

    onChange({ transform: getFigmaTransform(getFrames()[frameIndex]) });
  };

  return {
    idle,
    step,
  };
}
