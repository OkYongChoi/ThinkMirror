export interface Perspective {
  title: string;
  emoji: string;
  points: string[];
}

export interface ThinkResult {
  summary: string;
  perspectives: {
    devil: Perspective;
    expand: Perspective;
    weakness: Perspective;
    wildcard: Perspective;
  };
  question: string;
}
