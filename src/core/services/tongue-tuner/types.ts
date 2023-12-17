export interface SubtitlesFlatItem {
  start: number;
  estimatedDuration: number;
  text: string;
}

export interface SubtitlesFlat {
  duration: number;
  list: SubtitlesFlatItem[];
}
