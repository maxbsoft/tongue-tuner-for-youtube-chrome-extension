import {
  YoutubeVideoConfig,
  Seg,
  SubtitleEvent,
  SubtitleObject,
} from '../youtube-content-parser-api.types';

export interface Caption {
  timeStartMs: number;
  segment: string;
  durationMs: number;
  sTimeStart: string;
}

export interface CaptionDirectory {
  [key: string]: Caption;
}

export const GetVideoId = (): string | undefined => {
  const videoIDMatched = document?.location?.href?.match(/\/watch\?v=([^&]*)/);
  if (videoIDMatched && videoIDMatched.length > 0) {
    return videoIDMatched[1];
  }
  const embedIDMatched = document?.location?.href?.match(/\/embed\/([^?]*)/);
  if (embedIDMatched && embedIDMatched.length > 0) {
    return embedIDMatched[1];
  }
  return undefined;
};

const GenerateYoutbeiV1PlayerPostPayload = (ytConfig: YoutubeVideoConfig): string => {
  const context = ytConfig.INNERTUBE_CONTEXT;
  const videoId = GetVideoId();
  const payloadObj = {
    context: context,
    videoId: videoId,
  };

  //console.log("GenerateYoutbeiV1PlayerPostPayload generate", payloadObj);
  return JSON.stringify(payloadObj);
};

const GetYoutbeiV1PlayerData = async () => {
  // This solution is bad, something may change on YT and the whole logic will be broken. We need to think how to improve
  const nodeSnapshot: Node | null = document
    .evaluate(
      "//script[@nonce and contains(text(),'INNERTUBE_API_KEY')]",
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null,
    )
    .snapshotItem(0);
  if (!nodeSnapshot || (nodeSnapshot && nodeSnapshot.nodeType !== Node.ELEMENT_NODE)) {
    return undefined;
  }
  const element = nodeSnapshot as HTMLElement;

  const ytCfgJSON = element.innerText
    .replace(/^[\s\S]*ytcfg\.set\({/g, '{')
    .replace(/}\);\s*window\.ytcfg\.obfuscatedData_[\s\S]*/, '}');
  if (typeof ytCfgJSON != 'string' || ytCfgJSON.length <= 0) {
    console.log('ERROR: ytcfg.set({"CLIENT_CANARY_STATE... not found');
    return undefined;
  }

  try {
    const ytConfig: YoutubeVideoConfig | undefined = JSON.parse(ytCfgJSON);
    if (!ytConfig) {
      throw new Error('Error parse ytConfig');
    }
    console.log('TongueTuner ytConfig:', ytConfig);
    const key = ytConfig?.INNERTUBE_API_KEY;
    const payload = GenerateYoutbeiV1PlayerPostPayload(ytConfig);
    const targetUrl = `https://www.youtube.com/youtubei/v1/player?key=${key}&prettyPrint=false`;
    const res = await fetch(targetUrl, {
      method: 'POST',
      body: payload,
      headers: {
        'content-type': 'application/json',
      },
    });
    const resData = await res.json();
    console.log('TongueTuner resData:', resData);
    if (!resData?.captions?.playerCaptionsTracklistRenderer?.captionTracks) {
      console.log(
        'resData has no captionTracks. now try get player_response from ytInitialPlayerResponse',
        resData,
      );
      const ytInitialPlayerResponseElement: Node | null = document
        .evaluate(
          "//script[@nonce and contains(text(),'var ytInitialPlayerResponse')]",
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null,
        )
        .snapshotItem(0);
      if (
        !ytInitialPlayerResponseElement ||
        (ytInitialPlayerResponseElement &&
          ytInitialPlayerResponseElement.nodeType !== Node.ELEMENT_NODE)
      ) {
        console.log('ytInitialPlayerResponse not found.');
        return undefined;
      }
      const ytInitialPlayerResponseCode = (
        ytInitialPlayerResponseElement as HTMLElement
      ).innerText
        .replace('var ytInitialPlayerResponse = ', '')
        .replace(/};var .*/, '}');
      const ytInitialPlayerResponseObject = JSON.parse(ytInitialPlayerResponseCode);
      return ytInitialPlayerResponseObject;
    }
    return resData;
  } catch (err) {
    console.log('GetYoutbeiV1PlayerData got error', err, ytCfgJSON);
  }
  return undefined;
};

// player_response から .microformat.playerMicroformatRenderer.lengthSeconds を取り出します
const VideoLengthSecondsFromPlayerResponse = (player_response: any) => {
  return player_response?.videoDetails?.lengthSeconds;
};

const GuessVideoAutoTransrateOriginalLanguage = (player_response: any) => {
  let captionTracks =
    player_response?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  let autoDetectedCaption = captionTracks?.filter((x: any) => x['kind'] == 'asr');
  if (autoDetectedCaption) {
    return autoDetectedCaption[0]?.languageCode;
  }
  if (captionTracks) {
    return captionTracks[0]?.languageCode;
  }
  return undefined;
};

// var videoLengthSeconds = -1;
var guessedOriginalCaptionLanguage: any = undefined;
var playLocale = window.navigator.language;

var captionData = {};

const GetCaptionDataUrl = async () => {
  const player_response_obj = await GetYoutbeiV1PlayerData();

  console.log('TongueTuner, player_response_obj:', player_response_obj);

  let lengthSeconds = VideoLengthSecondsFromPlayerResponse(player_response_obj);

  console.log('TongueTuner lengthSeconds:', lengthSeconds);

  guessedOriginalCaptionLanguage =
    GuessVideoAutoTransrateOriginalLanguage(player_response_obj);
  console.log('guessedOriginalCaptionLanguage', guessedOriginalCaptionLanguage);

  // Use the provided subtitles for the target locale if available
  let captionTracks =
    player_response_obj?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  let playLocaleCaptionBaseUrl = captionTracks?.filter(
    (obj: any) => obj?.languageCode == playLocale,
  )[0]?.baseUrl;
  if (playLocaleCaptionBaseUrl) {
    return playLocaleCaptionBaseUrl + '&fmt=json3';
  }

  if (!captionTracks) {
    console.log('can not get captionTracks', player_response_obj);
    return;
  }
  let baseUrl = captionTracks[0]?.baseUrl;
  if (!baseUrl) {
    console.log('can not get baseUrl', player_response_obj);
    return;
  }
  let origUrl = baseUrl.replace(/,/g, '%2C');
  return origUrl + '&fmt=json3&xorb=2&xobt=3&xovt=3&tlang=' + playLocale;
};

function getStorageSync(keys: string[]) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys, resolve);
  });
}

function FormatTimeFromMillisecond(millisecond: number): string {
  let totalSecond = millisecond / 1000;
  let hour: number | string = parseInt(`${(totalSecond / 60 / 60) % 24}`);
  var minute: number | string = parseInt(`${(totalSecond / 60) % 60}`);
  var second: number | string = parseInt(`${totalSecond % 60}`);
  if (second < 10) {
    second = '0' + second;
  }
  if (hour > 0 && minute < 10) {
    minute = '0' + minute;
  }
  if (hour > 0) {
    return hour + ':' + minute + ':' + second;
  }
  return minute + ':' + second;
}

const CaptionDataToTimeDict = (captionData: SubtitleObject): CaptionDirectory => {
  let events = captionData.events;
  let captionArray = events
    .map((obj: SubtitleEvent) => {
      let timeStartMs = obj.tStartMs;
      let segment = obj.segs.reduce((acc: string, current: Seg) => {
        let text = current.utf8;
        if (text) {
          return acc + text;
        }
        return acc;
      }, '');
      return {
        timeStartMs,
        segment,
        durationMs: obj.dDurationMs,
        sTimeStart: FormatTimeFromMillisecond(timeStartMs),
      };
    })
    .filter((obj) => {
      let segment = obj.segment;
      if (segment?.length > 0 && segment.replace(/[\s\r\n]*/g, '').length > 0) {
        return true;
      }
      return false;
    });
  var timeDict: CaptionDirectory = {};
  captionArray.map((obj) => (timeDict[obj.sTimeStart] = obj));
  return timeDict;
};

export const FetchCaptionData = async () => {
  try {
    console.log('FetchCaptionData start');
    const videoId = GetVideoId();
    const url = await GetCaptionDataUrl();
    console.log('TongueTuner url2:', url);
    if (!url) {
      return undefined;
    }
    const response = await fetch(url);
    if (!response) {
      return undefined;
    }
    const json: SubtitleObject | undefined = await response.json();
    if (!json) {
      return undefined;
    }
    console.log('TongueTuner FetchCaptionData json:', json);
    const captionData: CaptionDirectory = CaptionDataToTimeDict(json);
    console.log('TongueTuner captionData updated', GetVideoId(), captionData);
    return captionData;
  } catch (err) {
    console.log('FetchCaptionData got error:', err, window.location.href);
  }
  return undefined;
};
