const { ipcRenderer } = require("electron");

// Elementos do DOM
const videoElement = document.getElementById(
  "videoElement"
) as HTMLVideoElement;
const videoOverlay = document.getElementById("videoOverlay") as HTMLDivElement;
const errorMessage = document.getElementById("errorMessage") as HTMLDivElement;
const retryBtn = document.getElementById("retryBtn") as HTMLButtonElement;
const minimizeBtn = document.getElementById("minimizeBtn") as HTMLButtonElement;
const closeBtn = document.getElementById("closeBtn") as HTMLButtonElement;
const toggleTopBtn = document.getElementById(
  "toggleTopBtn"
) as HTMLButtonElement;
const cameraSelect = document.getElementById(
  "cameraSelect"
) as HTMLSelectElement;

// Estado da aplicação
let stream: MediaStream | null = null;
let isAlwaysOnTop = true;
let currentDeviceId: string | null = null;

// Configurações da câmera
const cameraConstraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 },
  },
  audio: false,
};

// Função para iniciar a câmera
async function startCamera(): Promise<void> {
  try {
    // Mostrar overlay de carregamento
    videoOverlay.style.display = "flex";
    errorMessage.style.display = "none";

    if (stream) stopCamera();

    const cameraConstraints = {
      video: {
        deviceId: currentDeviceId ? { exact: currentDeviceId } : undefined,
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 },
      },
      audio: false,
    };

    // Solicitar acesso à câmera
    stream = await navigator.mediaDevices.getUserMedia(cameraConstraints);

    // Conectar stream ao elemento de vídeo
    videoElement.srcObject = stream;

    // Aguardar o vídeo estar pronto
    await new Promise<void>((resolve) => {
      videoElement.onloadedmetadata = () => resolve();
    });

    // Ocultar overlay quando o vídeo estiver pronto
    videoOverlay.style.display = "none";

    console.log("Câmera iniciada com sucesso");
  } catch (error) {
    console.error("Erro ao acessar a câmera:", error);
    showError();
  }
}

// Função para parar a câmera
function stopCamera(): void {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
  videoElement.srcObject = null;
}

// Função para mostrar erro
function showError(): void {
  videoOverlay.style.display = "none";
  errorMessage.style.display = "block";
}

// Função para alternar sempre no topo
async function toggleAlwaysOnTop(): Promise<void> {
  try {
    // @ts-ignore
    isAlwaysOnTop = await window.electronAPI.toggleAlwaysOnTop();
    updateToggleButton();
  } catch (error) {
    console.error("Erro ao alternar sempre no topo:", error);
  }
}

// Função para atualizar o ícone do botão de sempre no topo
function updateToggleButton(): void {
  const svg = toggleTopBtn.querySelector("svg");
  if (svg) {
    if (isAlwaysOnTop) {
      svg.innerHTML = '<path d="M8 2L2 8h3v6h6V8h3L8 2z" fill="currentColor"/>';
      toggleTopBtn.title = "Desativar sempre no topo";
    } else {
      svg.innerHTML =
        '<path d="M8 14L2 8h3V2h6v6h3L8 14z" fill="currentColor"/>';
      toggleTopBtn.title = "Ativar sempre no topo";
    }
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", async () => {
  await listCameras();
  startCamera();

  // Botão de minimizar
  minimizeBtn.addEventListener("click", () => {
    // @ts-ignore
    window.electronAPI.minimizeWindow();
  });

  // Botão de fechar
  closeBtn.addEventListener("click", () => {
    // @ts-ignore
    window.electronAPI.closeWindow();
  });

  // Botão de alternar sempre no topo
  toggleTopBtn.addEventListener("click", toggleAlwaysOnTop);

  // Botão de tentar novamente
  retryBtn.addEventListener("click", () => {
    startCamera();
  });

  // Atualizar botão de sempre no topo inicialmente
  updateToggleButton();
});

// Event listeners para o vídeo
videoElement.addEventListener("play", () => {
  console.log("Vídeo iniciado");
});

videoElement.addEventListener("error", (event) => {
  console.error("Erro no elemento de vídeo:", event);
  showError();
});

// Event listeners para teclas de atalho
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "Escape":
      // @ts-ignore
      window.electronAPI.closeWindow();
      break;
    case "F11":
      event.preventDefault();
      // @ts-ignore
      window.electronAPI.minimizeWindow();
      break;
    case "t":
    case "T":
      if (event.ctrlKey) {
        event.preventDefault();
        toggleAlwaysOnTop();
      }
      break;
  }
});

// Limpar recursos quando a página for descarregada
window.addEventListener("beforeunload", () => {
  stopCamera();
});

// Tratamento de erros globais
window.addEventListener("error", (event) => {
  console.error("Erro global:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Promise rejeitada não tratada:", event.reason);
});

// Exportar funções para uso global (se necessário)
(window as any).VideoBox = {
  startCamera,
  stopCamera,
  toggleAlwaysOnTop,
};

async function listCameras() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter((device) => device.kind === "videoinput");
  cameraSelect.innerHTML = "";
  videoDevices.forEach((device) => {
    const option = document.createElement("option");
    option.value = device.deviceId;
    option.text = device.label || `Câmera ${cameraSelect.length + 1}`;
    cameraSelect.appendChild(option);
  });
  // Seleciona a primeira disponível, ou mantém a atual se possível
  if (
    currentDeviceId &&
    videoDevices.some((d) => d.deviceId === currentDeviceId)
  ) {
    cameraSelect.value = currentDeviceId;
  } else if (videoDevices.length > 0) {
    currentDeviceId = videoDevices[0].deviceId;
    cameraSelect.value = currentDeviceId;
  }
}

cameraSelect.addEventListener("change", () => {
  currentDeviceId = cameraSelect.value;
  startCamera();
});

// Atualize a lista de câmeras quando dispositivos mudarem
navigator.mediaDevices.addEventListener("devicechange", listCameras);
