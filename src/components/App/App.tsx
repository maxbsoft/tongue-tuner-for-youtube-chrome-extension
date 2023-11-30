/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import './App.css';
import { useEffect, useState } from 'react';
import { useBearStore } from '@stores/bearStore';
import { getChromeUrl } from '@src/utils';
import logoPNG from '@assets/logo-png.png';
// you need to call toString() on the imported svg to get the path
import logoSVG from '@assets/logo-svg.svg';

import { UpdateFromBackgroundScript } from '../UpdateFromBackgroundScript/UpdateFromBackgroundScript';
import { FetchCaptionData } from '@src/core/services/youtube/utils/youtube';

export function App() {
  const t = 1;
  // use of a zustand store
  const bearStore = useBearStore();

  // use of normal react state
  const [isChecked, setIsChecked] = useState(false);
  const [inc, setInc] = useState(1);

  useEffect(() => {
    (async () => {
      const captions = await FetchCaptionData();
      console.log('TongueTuner captions:', captions);
    })();
  }, []);

  return (
    <div className="rcet-main-cointainer">
      <img
        onClick={() => setInc((prev) => prev + 1)}
        className="rcet-logo spin"
        src={`${getChromeUrl(logoPNG)}`}
        alt="logo"
      />
      {`${inc}`}
    </div>
  );
}
