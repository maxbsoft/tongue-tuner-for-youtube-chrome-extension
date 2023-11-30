export const getVideoPlayerData = async (
  innertubeApiKey: string,
  payload: { context: string; videoId: string },
) => {
  const apiUrl = `https://www.youtube.com/youtubei/v1/player?key=${key}&prettyPrint=false`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'content-type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
};
