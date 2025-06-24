# Video Box

Uma aplicação Electron moderna para exibir a webcam em uma janela arrastável, inspirada no [mini-video-me](https://github.com/maykbrito/mini-video-me) mas com as funcionalidades mais atuais do Electron.

## 🚀 Características

- **Janela arrastável**: Clique e arraste a janela para qualquer lugar da tela
- **Sempre no topo**: A janela permanece visível sobre outras aplicações
- **Interface moderna**: Design limpo com efeitos de transparência e blur
- **Controles intuitivos**: Botões para minimizar, fechar e alternar "sempre no topo"
- **Teclas de atalho**: Suporte a atalhos de teclado
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Seguro**: Usa contextIsolation e preload scripts (melhores práticas do Electron)

## 🛠️ Tecnologias

- **Electron 28**: Framework para aplicações desktop
- **TypeScript**: Tipagem estática para melhor desenvolvimento
- **HTML5 MediaDevices API**: Acesso à webcam
- **CSS3**: Estilos modernos com animações e efeitos

## 📦 Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd video-box
```

2. Instale as dependências:

```bash
npm install
```

## 🚀 Como usar

### Desenvolvimento

```bash
# Iniciar em modo desenvolvimento (com hot reload)
npm run dev
```

### Produção

```bash
# Compilar e executar
npm start
```

### Build para distribuição

```bash
# Criar executável para Windows
npm run dist:win
```

## 🎮 Controles

### Mouse

- **Arrastar janela**: Clique e arraste a barra de título ou qualquer área da janela
- **Minimizar**: Clique no botão `_` na barra de título
- **Fechar**: Clique no botão `×` na barra de título
- **Alternar sempre no topo**: Clique no botão flutuante no canto superior direito

### Teclado

- **ESC**: Fechar aplicação
- **F11**: Minimizar aplicação
- **Ctrl+T**: Alternar "sempre no topo"

## 🎨 Personalização

### Tamanho da janela

Edite o arquivo `src/main.ts` e modifique as propriedades `width` e `height`:

```typescript
mainWindow = new BrowserWindow({
  width: 400, // Largura da janela
  height: 300, // Altura da janela
  // ... outras configurações
});
```

### Estilos

Modifique o arquivo `src/renderer/styles.css` para personalizar a aparência:

```css
.app-container {
  background: rgba(0, 0, 0, 0.8); /* Cor de fundo */
  border-radius: 8px; /* Bordas arredondadas */
  /* ... outros estilos */
}
```

## 🔧 Configurações da câmera

As configurações da webcam podem ser ajustadas no arquivo `src/renderer/renderer.ts`:

```typescript
const cameraConstraints = {
  video: {
    width: { ideal: 1280 }, // Largura ideal
    height: { ideal: 720 }, // Altura ideal
    frameRate: { ideal: 30 }, // FPS ideal
  },
  audio: false,
};
```

## 📁 Estrutura do projeto

```
video-box/
├── src/
│   ├── main.ts              # Processo principal do Electron
│   ├── preload.ts           # Script preload (APIs seguras)
│   ├── renderer/
│   │   ├── index.html       # Interface HTML
│   │   ├── styles.css       # Estilos CSS
│   │   └── renderer.ts      # Lógica do renderer
│   └── types/
│       └── electron.d.ts    # Definições de tipos
├── dist/                    # Arquivos compilados
├── package.json
├── tsconfig.json
└── README.md
```

## 🐛 Solução de problemas

### Erro de permissão da câmera

- Verifique se o navegador tem permissão para acessar a câmera
- Clique em "Tentar novamente" na interface da aplicação

### Janela não aparece

- Verifique se não há outras instâncias da aplicação rodando
- Reinicie a aplicação

### Performance baixa

- Reduza a resolução da câmera nas configurações
- Feche outras aplicações que usam a câmera

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- Inspirado no projeto [mini-video-me](https://github.com/maykbrito/mini-video-me) do Mayk Brito
- Comunidade Electron por fornecer uma excelente documentação
- Todos os contribuidores que ajudaram a melhorar este projeto
