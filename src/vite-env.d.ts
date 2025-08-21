/// <reference types="vite/client" />

// Chrome Extension API types
declare global {
  interface Window {
    chrome: typeof chrome;
  }
  
  const chrome: {
    tabs: {
      query: (queryInfo: { active: boolean; currentWindow: boolean }, callback: (tabs: chrome.tabs.Tab[]) => void) => void;
    };
  };
}

export {};
