import { contextBridge, ipcRenderer } from "electron";

// Expor APIs seguras para o renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  // Controles da janela
  minimizeWindow: () => ipcRenderer.invoke("minimize-window"),
  closeWindow: () => ipcRenderer.invoke("close-window"),
  toggleAlwaysOnTop: () => ipcRenderer.invoke("toggle-always-on-top"),

  // Informações da aplicação
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),

  // Eventos
  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_event, ...args) => callback(...args));
  },

  once: (channel: string, callback: Function) => {
    ipcRenderer.once(channel, (_event, ...args) => callback(...args));
  },

  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
});

// Declaração de tipos para TypeScript
declare global {
  interface Window {
    electronAPI: {
      minimizeWindow: () => Promise<void>;
      closeWindow: () => Promise<void>;
      toggleAlwaysOnTop: () => Promise<boolean>;
      getAppVersion: () => Promise<string>;
      on: (channel: string, callback: Function) => void;
      once: (channel: string, callback: Function) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}
