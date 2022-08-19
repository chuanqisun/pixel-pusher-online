import type { CharacterAtlas } from "assets";
import { alec, ayla, bek, kradin, leif, lyster, meg, takari } from "assets";

export const avatars: Record<string, CharacterAtlas> = {
  alec,
  leif,
  meg,
  ayla,
  kradin,
  ela: takari,
  bek,
  lyster,
};
