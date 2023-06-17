// ThreeShakingのため、enumではなく、UnionTypeを使う
// https://engineering.linecorp.com/ja/blog/typescript-enum-tree-shaking
export const QuizTypeConstants = {
  PART_A: "PART_A",
  PART_B: "PART_B",
  PART_C: "PART_C",
} as const;

export type HiddenType = keyof typeof QuizTypeConstants | "ALL";
