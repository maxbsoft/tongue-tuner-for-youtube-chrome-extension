import { SubtitleLoader } from './SubtitleLoader';
import { AudioTrackManager } from './AudioTrackManager';
import { SyncManager } from './SyncManager';
import { TrackInfo } from './TrackInfo';
import { SubtitlesFlat } from '../services/tongue-tuner/types';
import { getProcessSubtitles } from '../services/tongue-tuner';

export class YoutubeVideoPageController {
  private subtitleLoader: SubtitleLoader;
  private audioTrackManager: AudioTrackManager;
  private syncManager: SyncManager;
  private subtitlesFlat: SubtitlesFlat | null | undefined;

  constructor() {
    this.subtitleLoader = new SubtitleLoader();
    this.audioTrackManager = new AudioTrackManager();
    this.syncManager = new SyncManager();
  }

  public async init(): Promise<void> {
    const captions = await this.subtitleLoader.loadSubtitles();
    if (!captions) {
      console.error('YoutubeVideoPageController: Failed to load subtitles.');
      return;
    }

    this.subtitlesFlat = await getProcessSubtitles(JSON.stringify(captions));
    if (!this.subtitlesFlat) {
      console.error('YoutubeVideoPageController: Failed to process subtitles.');
      return;
    }

    // Преобразование субтитров в аудиотреки
    const audioTracks: TrackInfo[] = this.subtitlesFlat.list.map((item, index) => {
      const nextItem = this.subtitlesFlat?.list[index + 1];
      const totalDuration = this.subtitlesFlat?.duration || 0;
      return {
        startTime: item.start,
        etimatedDuration: nextItem
          ? nextItem.start - item.start
          : totalDuration - item.start,
        realDuration: Infinity,
        text: item.text,
        index,
        isPlaying: false,
        currentAudioTime: 0,
        audio: null,
        isStreamLoading: false, // not in use at the moment
        isStartLoading: false,
        isLoaded: false,
        isCalcPlaybackRate: false,
      };
    });

    this.audioTrackManager.setAudioTracks(audioTracks);
  }

  public updateTime(time: number): void {
    const autidTracks = this.audioTrackManager.getAudioTracks();
    if (!autidTracks) {
      console.error('YoutubeVideoPageController: Failed to get audio tracks.');
      return;
    }

    // console.log('YoutubeVideoPageController: updateTime', time);

    this.audioTrackManager.updateTracks(time);

    this.audioTrackManager.stopTrackIfNeed();

    this.audioTrackManager.loadNextTrackIfNeed();

    if (
      this.audioTrackManager.getCurrentTrack() &&
      this.audioTrackManager.getCurrentTrack() === this.audioTrackManager.getPlayingTrack()
    ) {
      // The track you want to play is already playing
      return;
    }

    this.audioTrackManager.loadCurrentTrackIfNeed();

    this.audioTrackManager.playTrackIfNeed();
  }

  play() {
    this.audioTrackManager.play();
  }

  pause() {
    this.audioTrackManager.pause();
  }

  dispose() {
    // TODO: stop all tracks
    this.audioTrackManager.dispose();
  }
}
