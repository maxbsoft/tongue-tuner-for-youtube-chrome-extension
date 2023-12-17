import { InnertubeContext, VideoPlayerData } from './youtube-content-parser-api.types';

export const getVideoPlayerData = async (
  innertubeApiKey: string,
  payload: { context: InnertubeContext; videoId: string },
) => {
  console.log('Test');
  const apiUrl = `https://www.youtube.com/youtubei/v1/player?key=${innertubeApiKey}&prettyPrint=false`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'content-type': 'application/json',
    },
  });
  const data = await response.json();
  return data as VideoPlayerData;
};
