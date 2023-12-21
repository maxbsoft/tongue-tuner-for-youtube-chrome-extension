import {
  getVideoConfig,
  getVideoCaptionData,
  getVideoId,
} from '../services/youtube/youtube-content-parser-api';
import { SubtitleObject } from '../services/youtube/youtube-content-parser-api.types';
import { getVideoPlayerData } from '../services/youtube/youtube-rest-api';

export class SubtitleLoader {
  private videoId: string | undefined;
  private captions: SubtitleObject | null | undefined;

  constructor() {}

  public async loadSubtitles(): Promise<SubtitleObject | null> {
    this.videoId = getVideoId();
    const youtubeVideoConfig = getVideoConfig();
    const data = await getVideoPlayerData(youtubeVideoConfig.INNERTUBE_API_KEY, {
      context: youtubeVideoConfig.INNERTUBE_CONTEXT,
      videoId: this.videoId,
    });

    if (!data) {
      console.error('SubtitleLoader: Failed to load video player data.');
      return null;
    }

    this.captions = await getVideoCaptionData(data);
    return this.captions;
  }
}
