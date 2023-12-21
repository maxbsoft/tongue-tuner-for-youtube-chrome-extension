import { AudioStreamLoader } from './AudioStreamLoader';
import { TrackInfo } from './TrackInfo';

export class Track {
  private trackInfo: TrackInfo;
  private loader: AudioStreamLoader | null = null;
  constructor(trackInfo: TrackInfo, loader: AudioStreamLoader) {
    this.trackInfo = trackInfo;
    this.loader = loader;
  }

  public load(): void {
    // loader.getAudio();
  }

  public getTrackInfo(): TrackInfo {
    return this.trackInfo;
  }
}
