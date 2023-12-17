/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import './App.css';
import { useEffect, useState, useRef } from 'react';
import { useBearStore } from '@stores/bearStore';
import { getChromeUrl } from '@src/utils';
import logoPNG from '@assets/logo-png.png';
// you need to call toString() on the imported svg to get the path
import logoSVG from '@assets/logo-svg.svg';

import { UpdateFromBackgroundScript } from '../UpdateFromBackgroundScript/UpdateFromBackgroundScript';
import { FetchCaptionData } from '@src/core/services/youtube/utils/youtube';
import { YoutubeVideoPageController } from '@src/core/controllers/youtube-video-page.controller';
import { SubtitlesFlat } from '@src/core/services/tongue-tuner/types';
import { getTextToSpeachAudio } from '@src/core/services/tongue-tuner';

interface TrackInfo {
  currentTime: number;
  currentText: string;
  index: number;
  isPlaying: boolean;
  audio: HTMLAudioElement | null;
}
export function App() {
  const t = 1;
  // use of a zustand store
  const bearStore = useBearStore();

  // use of normal react state
  const [isChecked, setIsChecked] = useState(false);
  const [inc, setInc] = useState(1);
  // const [subtitlesFlat, setSubtitlesFlat] = useState<SubtitlesFlat | null>(null);
  const subtitlesFlatRef = useRef<SubtitlesFlat | null>(null);
  const currentTrackInfoRef = useRef<TrackInfo | null>(null);
  const conttrollerRef = useRef<YoutubeVideoPageController | null>(null);
  // const audioListRef = useRef(null);

  useEffect(() => {
    (async () => {
      // const captions = await FetchCaptionData();
      // console.log('TongueTuner captions:', captions);
      // const result = await startAnalysisYoutubeVideoPage();
      // console.log('TongueTuner result:', result);
      /*
      if (result !== undefined) {
        // setSubtitlesFlat(result);
        subtitlesFlatRef.current = result;
      }*/
      conttrollerRef.current = new YoutubeVideoPageController();
      await conttrollerRef.current.init();
    })();
    return () => {
      // cleanup
      if (conttrollerRef.current) {
        conttrollerRef.current.dispose();
      }
    };
  }, []);

  // console.log('subtitlesFlat:', subtitlesFlat);
  /*
  useEffect(() => {
    if (subtitlesFlat !== null) {
      // console.log('subtitlesFlat:', subtitlesFlat);
      // audioListRef.current = Promise.all(subtitlesFlat.list.map((item) => getTextToSpeachAudio(item.text)));
    }
  }, [subtitlesFlat]);
  */

  useEffect(() => {
    let videoElement = document.querySelector(
      '#movie_player > div.html5-video-container > video',
    ) as HTMLVideoElement | null;
    if (videoElement) {
      videoElement.addEventListener('play', () => {
        console.log('The video has started playing');
      });

      videoElement.addEventListener('pause', () => {
        console.log('Video has been suspended');
        conttrollerRef.current?.pause();
      });

      videoElement.addEventListener('timeupdate', (event) => {
        console.log('timeupdate', (videoElement?.currentTime || 0) * 1000);
        conttrollerRef.current?.updateTime((videoElement?.currentTime || 0) * 1000);
      });
    }
  }, []);

  return (
    <div className="rcet-main-cointainer">
      <a id="turnOnSubtitles" onClick={() => console.log('test')}>
        <img className="rcet-logo spin" src={`${getChromeUrl(logoPNG)}`} alt="logo" />
      </a>
      {`${inc}`}
    </div>
  );
}
