export interface TrackInfo {
  startTime: number;
  etimatedDuration: number;
  text: string;
  index: number;
  isPlaying: boolean;
  currentAudioTime: number;
  audio: HTMLAudioElement | null;
  realDuration: number;
  isStreamLoading: boolean;
  isStartLoading: boolean;
  isLoaded: boolean;
  isCalcPlaybackRate: boolean;
}
