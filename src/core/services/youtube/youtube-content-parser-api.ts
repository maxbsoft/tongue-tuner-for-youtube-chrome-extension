/**
 * Here is a set of functions that in one way or another serve to work with
 * the DOM of the page where YouTube Player is located to retrieve the necessary data.
 * For further manipulation.
 * All these functions work only in the context of a script that is injected into
 * a page with youtube videos, for example, a browser extension at the content script level
 */

import {
  SubtitleObject,
  VideoPlayerData,
  YoutubeVideoConfig,
} from './youtube-content-parser-api.types';

export enum YoutubeContentParserErrorCodes {
  PAGE_CONTEXT_ERROR = 40001,
  CONFIG_NOT_FOUND = 40002,
  CONFIG_PARSE_ERROR = 40003,
  PLAYER_INITIAL_RESPONSE_ELEMENT_NOT_FOUND = 40004,
  PLAYER_INITIAL_RESPONSE_PARSE_ERROR = 40005,
  CONTENT_UNKNOWN_ERROR = 40006,
  // Other error codes...
}

// Dictionary of Error Messages
export const YoutubeContentParserErrorMessages: {
  [key in YoutubeContentParserErrorCodes]: string;
} = {
  [YoutubeContentParserErrorCodes.PAGE_CONTEXT_ERROR]: 'Page context error',
  [YoutubeContentParserErrorCodes.CONFIG_NOT_FOUND]: 'YouTube configuration not found',
  [YoutubeContentParserErrorCodes.CONFIG_PARSE_ERROR]: 'YouTube configuration parse error',
  [YoutubeContentParserErrorCodes.PLAYER_INITIAL_RESPONSE_ELEMENT_NOT_FOUND]:
    'YouTube player initial response element not found',
  [YoutubeContentParserErrorCodes.PLAYER_INITIAL_RESPONSE_PARSE_ERROR]:
    'YouTube player initial response parse error',
  [YoutubeContentParserErrorCodes.CONTENT_UNKNOWN_ERROR]: 'YouTube content unknown error',
  // Other posts...
};

export class YoutubeContentParserError extends Error {
  code: YoutubeContentParserErrorCodes;
  additionalInfo: string | null;

  constructor(code: YoutubeContentParserErrorCodes, additionalInfo: string | null = null) {
    super(YoutubeContentParserErrorMessages[code]);
    this.code = code;
    this.additionalInfo = additionalInfo;
    this.name = 'YouTubeContentParserError';
  }

  getDetails() {
    return this.additionalInfo === null
      ? `Error ${this.code}: ${this.message}`
      : `Error ${this.code}: ${this.message} additionalInfo: ${this.additionalInfo}`;
  }
}

/**
 * Returns the ID of the open video
 */
export const getVideoId = (): string => {
  const videoIDMatched = document?.location?.href?.match(/\/watch\?v=([^&]*)/);
  if (videoIDMatched && videoIDMatched.length > 0) {
    return videoIDMatched[1];
  }
  const embedIDMatched = document?.location?.href?.match(/\/embed\/([^?]*)/);
  if (embedIDMatched && embedIDMatched.length > 0) {
    return embedIDMatched[1];
  }
  throw new YoutubeContentParserError(YoutubeContentParserErrorCodes.PAGE_CONTEXT_ERROR);
};

/**
 * Returns youtube player configuration
 */
export const getVideoConfig = () => {
  try {
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
      throw new YoutubeContentParserError(YoutubeContentParserErrorCodes.CONFIG_NOT_FOUND);
    }

    const element = nodeSnapshot as HTMLScriptElement;

    const videoConfigJSON = element.innerText
      .replace(/^[\s\S]*ytcfg\.set\({/g, '{')
      .replace(/}\);\s*window\.ytcfg\.obfuscatedData_[\s\S]*/, '}');
    if (typeof videoConfigJSON != 'string' || videoConfigJSON.length <= 0) {
      console.log('ERROR: ytcfg.set({"CLIENT_CANARY_STATE... not found');
      throw new YoutubeContentParserError(
        YoutubeContentParserErrorCodes.CONFIG_PARSE_ERROR,
      );
    }

    const videoConfig: YoutubeVideoConfig | undefined = JSON.parse(videoConfigJSON);
    if (!videoConfig) {
      throw new YoutubeContentParserError(
        YoutubeContentParserErrorCodes.CONFIG_PARSE_ERROR,
      );
    }
    return videoConfig;
  } catch (error: any) {
    if (error instanceof YoutubeContentParserError) {
      throw error;
    } else {
      throw new YoutubeContentParserError(
        YoutubeContentParserErrorCodes.CONTENT_UNKNOWN_ERROR,
        error.message,
      );
    }
  }
};

/**
 * Returns youtube player initial data
 */
export const getVideoPlayerData = () => {
  try {
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
      throw new YoutubeContentParserError(
        YoutubeContentParserErrorCodes.PLAYER_INITIAL_RESPONSE_ELEMENT_NOT_FOUND,
      );
    }
    const ytInitialPlayerResponseCode = (
      ytInitialPlayerResponseElement as HTMLElement
    ).innerText
      .replace('var ytInitialPlayerResponse = ', '')
      .replace(/};var .*/, '}');
    const ytInitialPlayerResponseObject = JSON.parse(ytInitialPlayerResponseCode);
    if (!ytInitialPlayerResponseObject) {
      throw new YoutubeContentParserError(
        YoutubeContentParserErrorCodes.PLAYER_INITIAL_RESPONSE_PARSE_ERROR,
      );
    }
    return ytInitialPlayerResponseObject;
  } catch (error: any) {
    if (error instanceof YoutubeContentParserError) {
      throw error;
    } else if (error instanceof SyntaxError) {
      throw new YoutubeContentParserError(
        YoutubeContentParserErrorCodes.PLAYER_INITIAL_RESPONSE_PARSE_ERROR,
        error.message,
      );
    } else {
      throw new YoutubeContentParserError(
        YoutubeContentParserErrorCodes.CONTENT_UNKNOWN_ERROR,
        error.message,
      );
    }
  }
};

const getVideoAutoTransrateOriginalLanguage = (videodata: VideoPlayerData) => {
  let captionTracks = videodata?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  let autoDetectedCaption = captionTracks?.filter((x: any) => x['kind'] == 'asr');
  if (autoDetectedCaption) {
    return autoDetectedCaption[0]?.languageCode;
  }
  if (captionTracks) {
    return captionTracks[0]?.languageCode;
  }
  return undefined;
};

export const getVideoCaptionData = async (videodata: VideoPlayerData) => {
  const originalCaptionLanguage = getVideoAutoTransrateOriginalLanguage(videodata);
  console.log('originalCaptionLanguage:', originalCaptionLanguage);

  const { captionTracks } = videodata?.captions?.playerCaptionsTracklistRenderer || {};
  if (!captionTracks) {
    console.log('can not get captionTracks', videodata);
    return null;
  }
  let playLocaleCaptionBaseUrl = captionTracks?.filter(
    (obj: any) => obj?.languageCode == 'ru',
  )[0]?.baseUrl;
  let url: string | null | undefined = null;
  if (playLocaleCaptionBaseUrl) {
    url = playLocaleCaptionBaseUrl + '&fmt=json3';
  }

  if (!url) {
    url = captionTracks[0]?.baseUrl;
    if (!url) {
      console.log('can not get baseUrl', videodata);
      return null;
    }
    url = url.replace(/,/g, '%2C');
    url = url + '&fmt=json3&xorb=2&xobt=3&xovt=3&tlang=' + 'ru';
  }

  console.log('url:', url);

  const response = await fetch(url);

  if (!response) {
    return null;
  }
  const json: SubtitleObject | undefined = await response.json();
  if (!json) {
    return null;
  }

  return json;
};
