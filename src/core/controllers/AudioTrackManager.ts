import { getTextToSpeachAudio } from '../services/tongue-tuner';
import { TrackInfo } from './TrackInfo';
import { AudioStreamLoader } from './AudioStreamLoader';

export class AudioTrackManager {
  private audioTracks: TrackInfo[] | undefined;
  private currentTime: number = 0;
  private currentTrackIndex: number = -1;
  private playingTrackIndex: number = -1;
  private nextTrackIndex: number = -1;

  constructor() {}

  public setAudioTracks(tracks: TrackInfo[]): void {
    this.audioTracks = tracks;
  }

  public getAudioTracks(): TrackInfo[] | undefined {
    return this.audioTracks;
  }

  // Логика определения текущего, следующего и проигрываемого треков
  private determineTracks(time: number): void {
    if (!this.audioTracks) {
      return;
    }
    this.playingTrackIndex = this.audioTracks.findIndex((track) => track.isPlaying);
    this.currentTrackIndex = this.audioTracks.findIndex((track) => {
      if (time >= track.startTime && time < track.startTime + track.etimatedDuration) {
        return true;
      }
      return false;
    });

    if (this.currentTrackIndex < 0) {
      return;
    }
    this.nextTrackIndex =
      this.currentTrackIndex + 1 < this.audioTracks.length
        ? this.currentTrackIndex + 1
        : -1;
    // console.log('currentTrackIndex:', this.currentTrackIndex);
    // console.log('nextTrackIndex:', this.nextTrackIndex);
    // console.log('playingTrackIndex:', this.playingTrackIndex);
  }

  private getTrackByIndex(index: number): TrackInfo | null {
    if (!this.audioTracks) {
      return null;
    }
    if (index < 0 || index >= this.audioTracks.length) {
      return null;
    }
    return this.audioTracks[index];
  }

  public getCurrentTrack(): TrackInfo | null {
    return this.getTrackByIndex(this.currentTrackIndex);
  }

  public getPlayingTrack(): TrackInfo | null {
    return this.getTrackByIndex(this.playingTrackIndex);
  }

  public getNextTrack(): TrackInfo | null {
    return this.getTrackByIndex(this.nextTrackIndex);
  }

  /*
// Need to stop playback if it is in progress but not in time
    if (
      plaiyngTrack &&
      activeTrackByTime &&
      plaiyngTrack.isPlaying &&
      activeTrackByTime !== plaiyngTrack
    ) {
      plaiyngTrack.isPlaying = false;
      plaiyngTrack.isCalcPlaybackRate = false;
      plaiyngTrack.audio?.pause();
      // TODO: need to clear event listeners for audio
      console.log('Current time:', this.currentTime);
      console.log('pause track:', indexTrackPlaiyng);
    }
  */
  public stopTrackIfNeed(): void {
    const playingTrack = this.getPlayingTrack();
    const activeTrackByTime = this.getCurrentTrack();
    if (
      playingTrack &&
      activeTrackByTime &&
      playingTrack.isPlaying &&
      activeTrackByTime !== playingTrack
    ) {
      console.log('call stopTrackIfNeed');
      playingTrack.isPlaying = false;
      playingTrack.isCalcPlaybackRate = false;
      playingTrack.audio?.pause();
    }
  }

  public async loadNextTrackIfNeed(): Promise<void> {
    const nextTrack = this.getNextTrack();
    const currentTrack = this.getCurrentTrack();
    try {
      if (
        nextTrack &&
        !nextTrack.isStartLoading &&
        !nextTrack.isLoaded &&
        currentTrack &&
        currentTrack.isPlaying &&
        currentTrack.realDuration !== Infinity
      ) {
        console.log('call loadNextTrackIfNeed');
        await this.loadAudioTrack(nextTrack);
      }
    } catch (error) {
      console.error(`loadNextTrackIfNeed,error: ${error}`);
    }
  }

  public playTrackIfNeed() {
    const currentTrack = this.getCurrentTrack();
    if (!currentTrack) {
      return;
    }
    const { audio } = currentTrack;
    console.log('call playTrackIfNeed', audio);
    if (audio) {
      currentTrack.isPlaying = true;
      console.log('Current time:', this.currentTime);
      console.log('play track:', currentTrack.index);
      currentTrack.isCalcPlaybackRate = false;
      audio.currentTime = 0;
      audio.play();
    }
  }

  public async loadCurrentTrackIfNeed(): Promise<void> {
    const currentTrack = this.getCurrentTrack();
    if (!currentTrack) {
      return;
    }
    // If the track is not loaded, then load it
    if (!currentTrack.isStartLoading && !currentTrack.isLoaded) {
      console.log('call loadCurrentTrackIfNeed');
      const text = currentTrack.text;
      currentTrack.isStartLoading = true;
      console.log('Current time:', this.currentTime);
      console.log('Start getTextToSpeachAudio,index:', currentTrack.index);
      await this.loadAudioTrack(currentTrack);
    }
  }

  private trackTimeUpdateHandler(event: Event, track: TrackInfo): void {
    const { audio } = track;
    if (!audio) {
      return;
    }
    const currentAudioTime = audio.currentTime * 1000;
    const currentAudioDuration =
      audio.duration !== Infinity ? audio.duration * 1000 : Infinity;

    track.realDuration = currentAudioDuration;
    track.currentAudioTime = currentAudioTime;

    const latency = this.currentTime - (track.startTime + currentAudioTime);

    if (track.realDuration !== Infinity && !track.isCalcPlaybackRate) {
      const realLeftTime = track.realDuration - track.currentAudioTime;
      console.log('realLeftTime:', realLeftTime);
      const trackLeftTime = track.startTime + track.etimatedDuration - this.currentTime;
      console.log('trackLeftTime:', trackLeftTime);
      if (realLeftTime > trackLeftTime) {
        const needPlaybackRate = realLeftTime / trackLeftTime;
        console.log('needPlaybackRate:', needPlaybackRate);

        audio.playbackRate = needPlaybackRate;
      }
      track.isCalcPlaybackRate = true;
    }
  }

  private trackDurationChangeHandler(event: Event, track: TrackInfo): void {
    const { audio } = track;
    if (!audio) {
      return;
    }
    track.realDuration = audio.duration * 1000;
    console.log('Current time:', this.currentTime);
    console.log('durationchange:', track.index, 'realDuration:', track.realDuration);
  }

  private trackEndedHandler(event: Event, track: TrackInfo): void {
    const { audio } = track;
    if (!audio) {
      return;
    }
    const currentAudioTime = audio.currentTime * 1000;
    const latency = this.currentTime - (track.startTime + currentAudioTime);
    track.isPlaying = false;
    track.isCalcPlaybackRate = false;
    audio.currentTime = 0;
    console.log('Current time:', this.currentTime);
    console.log('ended track:', track.index);
  }

  private async loadAudioTrack(track: TrackInfo): Promise<void> {
    try {
      track.isStartLoading = true;
      console.log('loadAudioTrack: Current time:', this.currentTime);
      console.log('loadAudioTrack: Start getTextToSpeachAudio,index:', track.index);
      const text = track.text;
      const stream = await getTextToSpeachAudio(text);
      const audioStreamLoader = new AudioStreamLoader(stream);
      track.audio = audioStreamLoader.getAudio();
      track.isLoaded = true;
      track.isStartLoading = false;
      track.audio.addEventListener('timeupdate', (event) =>
        this.trackTimeUpdateHandler(event, track),
      );
      track.audio.addEventListener('durationchange', (event) => {
        this.trackDurationChangeHandler(event, track);
      });
      track.audio.addEventListener('ended', (event) => {
        this.trackEndedHandler(event, track);
      });
    } catch (error) {
      console.error(`loadAudioTrack,error: ${error}`);
    }
  }

  public async updateTracks(time: number): Promise<void> {
    this.currentTime = time;
    this.determineTracks(time);
  }

  public pause(): void {
    const playingTrack = this.getPlayingTrack();
    if (!playingTrack) {
      return;
    }
    if (playingTrack.isPlaying) {
      playingTrack.isPlaying = false;
      playingTrack.audio?.pause();
    }
  }

  public play(): void {
    const currentTrack = this.getCurrentTrack();
    if (!currentTrack) {
      return;
    }
    if (!currentTrack.isPlaying) {
      currentTrack.isPlaying = true;
      currentTrack.audio?.play();
    }
  }

  public dispose(): void {
    // TODO: stop all tracks
  }

  /*
  public async loadAudioTrack(text: string): Promise<HTMLAudioElement> {
    return getTextToSpeachAudio(text);
  }
  */
}
