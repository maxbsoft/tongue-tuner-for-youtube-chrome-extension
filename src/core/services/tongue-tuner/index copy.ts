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

export const getTextToSpeachAudio = async (text: string): Promise<HTMLAudioElement> => {
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

  const mediaSource = new MediaSource();
  const audio = new Audio();
  audio.src = URL.createObjectURL(mediaSource);

  mediaSource.addEventListener('sourceopen', () => {
    if (!response.body) {
      return;
    }
    const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg'); // Specify MIME type
    const reader = response.body.getReader();

    // Function for adding data to SourceBuffer
    const appendToBuffer = (data: Uint8Array) => {
      if (!sourceBuffer.updating) {
        sourceBuffer.appendBuffer(data);
      } else {
        setTimeout(() => appendToBuffer(data), 10); // Retry after a short period of time
      }
    };

    // Function for reading and processing the data stream
    const process = ({ done, value }: { done: boolean; value: Uint8Array }) => {
      if (done) {
        mediaSource.endOfStream();
        return;
      }
      appendToBuffer(value);
      // @ts-ignore
      reader.read().then(process);
    };

    // Start reading the data stream
    // @ts-ignore
    reader.read().then(process);
  });

  return audio;
};
