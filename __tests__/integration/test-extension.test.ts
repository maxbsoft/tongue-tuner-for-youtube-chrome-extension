import puppeteer from 'puppeteer';
// import { startAnalysisYoutubeVideoPage } from '../../src/core/controllers/youtube-video-page.controller';
const pathToExtension = `${__dirname}`.replace('__tests__/integration', 'dist');

console.log('pathToExtension:', pathToExtension);
jest.setTimeout(600000);

describe('my extension', () => {
  it('does something', async () => {
    const browser = await puppeteer.launch({
      headless: false, // extension are allowed only in head-full mode
      devtools: true,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        '--disable-web-security',
      ],
      userDataDir: '/Users/maxb/Library/Application Support/Google/Chrome/Default',
    });

    const page = await browser.newPage();
    page.setViewport({ width: 1366, height: 768 });

    // Enable request interception
    // await page.setRequestInterception(true);

    // Add an event listener for 'request'
    // page.on('request', (request) => {
    //   if (request.url().endsWith('/youtubei/v1/player')) {
    //     // Respond with mock data
    //     request.respond({
    //       status: 200,
    //       contentType: 'application/json',
    //       body: JSON.stringify({
    //         /* your mock data */
    //       }),
    //     });
    //   } else {
    //     // Allow the request to continue with its intended destination
    //     request.continue();
    //   }
    // });

    // await page.goto('https://www.youtube.com/watch?v=LzA_mO2YW7s');
    // await page.goto('https://www.youtube.com/watch?v=4Bdc55j80l8');
    await page.goto('https://www.youtube.com/watch?v=bCz4OMemCcA');
    await new Promise((r) => setTimeout(r, 5000));
    // Further actions and assertions...
    page.evaluate(() => {
      // @ts-ignore
      console.log('start test');

      // @ts-ignore
      const button = document.getElementById('turnOnSubtitles');
      console.log('button', button);
      button?.click();

      console.log('end test');
    });

    await new Promise((r) => setTimeout(r, 4000000));
    // await startAnalysisYoutubeVideoPage();

    await browser.close();
  });
});
