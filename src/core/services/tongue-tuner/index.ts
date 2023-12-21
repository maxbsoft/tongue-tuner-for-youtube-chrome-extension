import { baseApiUrl } from './constants';
import { SubtitlesFlat } from './types';

export const getProcessSubtitles = async (subtitles: string) => {
  const apiUrl = `${baseApiUrl}/openai-tts/process-subtitles`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    body: subtitles,
    headers: {
      'content-type': 'application/json',
    },
  });
  const data = (await response.json()) as SubtitlesFlat;
  return data;
};

export const getTextToSpeachAudio = async (
  text: string,
): Promise<ReadableStream<Uint8Array>> => {
  const apiUrl = `${baseApiUrl}/openai-tts/text-to-speach`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify({ text }),
    headers: {
      'content-type': 'application/json',
    },
  });

  if (!response.body) {
    throw new Error('The response does not contain a data stream.');
  }
  return response.body;
};
