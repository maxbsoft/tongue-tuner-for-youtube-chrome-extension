import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import { PopUp } from './components/PopUp';
import AppProvider from './AppContext';

declare global {
  interface Window {
    test1: () => Promise<void>;
  }
}

const getTongueTunerContainer = () => {
  let container = document.getElementById('tongueTuner');
  if (container) {
    return container;
  }
  const ytpRightControlsClassElements =
    document.getElementsByClassName('ytp-right-controls');
  if (ytpRightControlsClassElements.length > 0) {
    const ytpRightControls = ytpRightControlsClassElements[0];
    if (ytpRightControls && ytpRightControls.firstChild) {
      const myCont = document.createElement('DIV');
      myCont.id = 'tongueTuner';
      myCont.className = 'ytp-button';
      ytpRightControls.insertBefore(myCont, ytpRightControls.firstChild);
      return myCont;
    }
  }

  return null;
};

console.log('TongueTuner Entry', document.location.href);

window.test1 = async () => {
  // Your code logic here
  console.log('TEST1');
  // const result = await startAnalysisYoutubeVideoPage();
  // return result;
};

// Function for handling URL changes
function onUrlChange(url: string) {
  console.log('TongueTuner URL has been changed:', url);
  // Additional logic for handling URL changes
  if (url.includes('youtube.com/watch')) {
    console.log('window.test1:', window.test1);
    const container = getTongueTunerContainer();
    if (container) {
      console.log('TongueTuner container exists');
      const root = createRoot(container!);

      root.render(
        <React.StrictMode>
          <AppProvider>
            <App />
          </AppProvider>
        </React.StrictMode>,
      );
    } else {
      console.log('TongueTuner container NOT exists');
    }
  }
}

const observeUrlChange = () => {
  let oldHref = document.location.href;
  console.log('TongueTuner,body:', document.body);
  const observer = new MutationObserver((mutations) => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
      onUrlChange(document.location.href);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
};

// This part is for popup
if (!document.location.href.includes('youtube.com')) {
  console.log('TongueTuner create popup');
  const container = document.getElementById('root');
  const root = createRoot(container!);
  root.render(
    <React.StrictMode>
      <AppProvider>
        <PopUp />
      </AppProvider>
    </React.StrictMode>,
  );
} else {
  observeUrlChange();
  onUrlChange(document.location.href);
}
