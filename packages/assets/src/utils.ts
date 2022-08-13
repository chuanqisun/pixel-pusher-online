// In R1: a, b, c, d, tx, ty
// In R2:
// a, c, tx
// b, d, ty
// 0, 0, 1

export const transforms = {
  FLIP_HORIZONTAL: [-1, 0, 0, 1, 0, 0],
};

export function toRank2(r1: number[]) {
  return [
    [r1[0], r1[2], r1[4]],
    [r1[1], r1[3], r1[5]],
  ];
}
