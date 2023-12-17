declare module '*.jpg';
declare module '*.png';
declare module '*.jpeg';

declare global {
  interface Window {
    test1: () => Promise<void>;
  }
}
