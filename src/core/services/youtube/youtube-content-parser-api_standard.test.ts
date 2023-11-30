/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://www.youtube.com/watch?v=Hegjqza2OHw"}
 */

import {
  YoutubeContentParserErrorCodes,
  YoutubeContentParserError,
  getVideoId,
  getVideoConfig,
  getVideoPlayerData,
} from './youtube-content-parser-api';
import { YoutubeVideoConfig } from './youtube-content-parser-api.types';

function createMockScript() {
  const scriptText =
    'var ytcfg = { set: (obj) => obj }; ytcfg.set({"INNERTUBE_API_KEY": "test-key", "otherConfig": "value"});';
  const script = document.createElement('script');
  script.textContent = scriptText;
  script.setAttribute('nonce', '12345');
  script.innerText =
    'ytcfg.set({"INNERTUBE_API_KEY": "test-key", "otherConfig": "value"});window.ytcfg.obfuscatedData_dw2';
  document.body.appendChild(script);
}

/**
 * Jest test file
 */
describe('youtube-content-parser-api (Standard Page)', () => {
  test('getVideoId should return correct ID for standard YouTube page', () => {
    const videoId = getVideoId();
    expect(videoId).toBe('Hegjqza2OHw');
  });

  test('getVideoConfig should return valid configuration object', () => {
    document.documentElement.innerHTML = '<html><body></body></html>';
    const scriptText =
      'var ytcfg = { set: (obj) => obj }; ytcfg.set({"INNERTUBE_API_KEY": "test-key", "otherConfig": "value"});';
    const script = document.createElement('script');
    script.textContent = scriptText;
    script.setAttribute('nonce', '12345');
    script.innerText =
      'ytcfg.set({"INNERTUBE_API_KEY": "test-key", "otherConfig": "value"});window.ytcfg.obfuscatedData_dw2';
    document.body.appendChild(script);

    const videoConfig = getVideoConfig();
    expect(videoConfig).toBeDefined();
    expect(videoConfig.INNERTUBE_API_KEY).toBe('test-key');
  });

  test('getVideoConfig should throw CONFIG_NOT_FOUND error when script is missing', () => {
    document.documentElement.innerHTML = '';
    expect(() => {
      getVideoConfig();
    }).toThrowError(
      new YoutubeContentParserError(YoutubeContentParserErrorCodes.CONFIG_NOT_FOUND),
    );
  });
});
