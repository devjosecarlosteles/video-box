import { app, BrowserWindow, ipcMain, screen } from "electron";
import * as path from "path";

let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  // Obter as dimensões da tela principal
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // Criar a janela principal
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    x: Math.floor((width - 400) / 2),
    y: Math.floor((height - 300) / 2),
    frame: false, // Remove a barra de título padrão
    transparent: true, // Permite transparência
    resizable: false, // Não permite redimensionar
    alwaysOnTop: true, // Mantém sempre no topo
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    show: false, // Não mostra até estar pronto
  });

  // Carregar o arquivo HTML
  mainWindow.loadFile(path.join(__dirname, "../src/renderer/index.html"));

  // Mostrar a janela quando estiver pronta
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  // Limpar referência quando a janela for fechada
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Desabilitar menu padrão
  mainWindow.setMenu(null);
};

// Este método será chamado quando o Electron terminar de inicializar
app.whenReady().then(createWindow);

// Quit quando todas as janelas estiverem fechadas
app.on("window-all-closed", () => {
  // No macOS é comum para aplicações manterem ativas mesmo quando todas as janelas estão fechadas
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // No macOS é comum recriar uma janela quando o ícone do dock é clicado
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers para comunicação entre processos
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

ipcMain.handle("minimize-window", () => {
  mainWindow?.minimize();
});

ipcMain.handle("close-window", () => {
  mainWindow?.close();
});

ipcMain.handle("toggle-always-on-top", () => {
  if (mainWindow) {
    const isAlwaysOnTop = mainWindow.isAlwaysOnTop();
    mainWindow.setAlwaysOnTop(!isAlwaysOnTop);
    return !isAlwaysOnTop;
  }
  return false;
});
