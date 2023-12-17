import { getProcessSubtitles, getTextToSpeachAudio } from '../services/tongue-tuner';
import { SubtitlesFlat } from '../services/tongue-tuner/types';
import {
  getVideoCaptionData,
  getVideoConfig,
  getVideoId,
} from '../services/youtube/youtube-content-parser-api';
import { SubtitleObject } from '../services/youtube/youtube-content-parser-api.types';
import { getVideoPlayerData } from '../services/youtube/youtube-rest-api';

const TAG = '[TEST]';

interface TrackInfo {
  startTime: number;
  etimatedDuration: number;
  text: string;
  index: number;
  isPlaying: boolean;
  currentAudioTime: number;
  audio: HTMLAudioElement | null;
  isStreamLoading: boolean;
  isStartLoading: boolean;
  isLoaded: boolean;
}

export class YoutubeVideoPageController {
  private videoId: string | undefined;
  private captions: SubtitleObject | null | undefined;
  private subtitlesFlat: SubtitlesFlat | null | undefined;
  private audioTracks: TrackInfo[] | null | undefined;
  private currentTime: number = 0;
  private indexTrackActiveByTime: number = -1;
  private indexTrackPlaiyng: number = -1;
  private indexNextTrack: number = -1;
  constructor() {}

  public async init() {
    this.videoId = getVideoId();
    console.log(TAG, 'getVideoId', this.videoId);
    const youtubeVideoConfig = getVideoConfig();
    console.log(TAG, 'youtubeVideoConfig', youtubeVideoConfig);
    const data = await getVideoPlayerData(youtubeVideoConfig.INNERTUBE_API_KEY, {
      context: youtubeVideoConfig.INNERTUBE_CONTEXT,
      videoId: this.videoId,
    });
    console.log(TAG, 'getVideoPlayerData,data:', data);

    if (!data) {
      console.log(TAG, 'getVideoPlayerData,data is empty');
      return;
    }
    this.captions = await getVideoCaptionData(data);
    console.log('captions:', this.captions);
    console.log('captionsJson:', JSON.stringify(this.captions));
    this.subtitlesFlat = await getProcessSubtitles(JSON.stringify(this.captions));
    console.log('subtitlesFlat:', this.subtitlesFlat);
    if (!this.subtitlesFlat) {
      return;
    }
    this.audioTracks = this.subtitlesFlat.list.map((item, index) => {
      const nextItem = this.subtitlesFlat?.list[index + 1];
      const totalDuration = this.subtitlesFlat?.duration || 0;
      return {
        startTime: item.start,
        etimatedDuration: nextItem
          ? nextItem.start - item.start
          : totalDuration - item.start,
        text: item.text,
        index,
        isPlaying: false,
        currentAudioTime: 0,
        audio: null,
        isStreamLoading: false, // not in use at the moment
        isStartLoading: false,
        isLoaded: false,
      };
    });
  }

  public getVideoId() {
    return this.videoId;
  }

  public getTrackByIndex(index: number) {
    if (!this.audioTracks) {
      return null;
    }

    if (index < 0 || index > this.audioTracks.length - 1) {
      return null;
    }
    return this.audioTracks[index];
  }

  public updateTime(time: number) {
    this.currentTime = time;
    if (!this.audioTracks) {
      return;
    }
    this.indexTrackActiveByTime = this.audioTracks.findIndex((track) => {
      if (time >= track.startTime && time < track.startTime + track.etimatedDuration) {
        return true;
      }
      return false;
    });

    this.indexTrackPlaiyng = this.audioTracks.findIndex((track) => track.isPlaying);

    this.indexNextTrack =
      this.indexTrackActiveByTime >= 0 ? this.indexTrackActiveByTime + 1 : -1;

    const { indexTrackActiveByTime, indexTrackPlaiyng, indexNextTrack } = this;
    const activeTrackByTime = this.getTrackByIndex(indexTrackActiveByTime);
    const plaiyngTrack = this.getTrackByIndex(indexTrackPlaiyng);
    const nextTrack = this.getTrackByIndex(indexNextTrack);

    // Need to stop playback if it is in progress but not in time
    if (
      plaiyngTrack &&
      activeTrackByTime &&
      plaiyngTrack.isPlaying &&
      activeTrackByTime !== plaiyngTrack
    ) {
      plaiyngTrack.isPlaying = false;
      plaiyngTrack.audio?.pause();
      // TODO: need to clear event listeners for audio
      console.log('pause track:', indexTrackPlaiyng);
    }

    if (!activeTrackByTime) {
      // here we have no tracks to play.
      return;
    }

    if (activeTrackByTime === plaiyngTrack) {
      // The track you want to play is already playing
      return;
    }

    // If the track is not loaded, then load it
    if (!activeTrackByTime.isStartLoading && !activeTrackByTime.isLoaded) {
      const text = activeTrackByTime.text;
      activeTrackByTime.isStartLoading = true;
      getTextToSpeachAudio(text)
        .then((audio) => {
          if (activeTrackByTime) {
            activeTrackByTime.audio = audio;
            activeTrackByTime.isLoaded = true;
            activeTrackByTime.isStartLoading = false;
          }
        })
        .catch((error) => {
          // TODO: handle error
          console.log('getTextToSpeachAudio error:', error);
        });
    }

    // If the track is not playing, play it.
    if (activeTrackByTime.isLoaded && !activeTrackByTime.isPlaying) {
      activeTrackByTime.isPlaying = true;
      const audio = activeTrackByTime.audio;
      audio?.addEventListener('timeupdate', (event) => {
        if (this.audioTracks) {
          const currentAudioTime = audio.currentTime * 1000;
          const currentAudioDuration = audio.duration * 1000;
          activeTrackByTime.currentAudioTime = currentAudioTime;
          console.log(
            'track:',
            activeTrackByTime.index,
            'audio timestamp',
            currentAudioTime,
            'currentAudioDuration',
            currentAudioDuration,
          );
          const latency =
            this.currentTime - (activeTrackByTime.startTime + currentAudioTime);
          console.log('latency', latency);
        }
      });
      audio?.addEventListener('ended', (event) => {
        if (this.audioTracks) {
          const currentAudioTime = audio.currentTime * 1000;
          console.log('track ended:', 'audio timestamp', event.timeStamp);
          const latency =
            this.currentTime - (activeTrackByTime.startTime + currentAudioTime);
          console.log('latency', latency);
          activeTrackByTime.isPlaying = false;
          audio.currentTime = 0;
        }
      });
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }
    }

    // we need to somehow load the next track in advance

    if (
      nextTrack &&
      !nextTrack.isStartLoading &&
      !nextTrack.isLoaded &&
      activeTrackByTime &&
      activeTrackByTime.isPlaying
    ) {
      const text = nextTrack.text;
      nextTrack.isStartLoading = true;
      getTextToSpeachAudio(text)
        .then((audio) => {
          if (this.audioTracks) {
            this.audioTracks[indexNextTrack].audio = audio;
            this.audioTracks[indexNextTrack].isLoaded = true;
            this.audioTracks[indexNextTrack].isStartLoading = false;
          }
        })
        .catch((error) => {
          console.log('getTextToSpeachAudio error:', error);
        });
    }
  }

  pause() {
    if (!this.audioTracks) {
      return;
    }
    const indexTrackPlaiyng = this.audioTracks.findIndex((track) => track.isPlaying);
    if (indexTrackPlaiyng >= 0 && this.audioTracks[indexTrackPlaiyng].isPlaying) {
      this.audioTracks[indexTrackPlaiyng].isPlaying = false;
      this.audioTracks[indexTrackPlaiyng].audio?.pause();
    }
  }

  dispose() {
    // TODO: stop all tracks
  }
}
