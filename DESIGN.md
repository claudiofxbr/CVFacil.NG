# Design System - CVFacil.NG (Neon Dark Edition)

Este documento define a identidade visual "Premium" do projeto, focada em alto contraste, efeitos vítreos e estética Neon.

## Paleta de Cores

| Nome | Valor Hex | Uso |
| :--- | :--- | :--- |
| **Deep Background** | `#0a0a0c` | Fundo principal da aplicação |
| **Glass Background** | `rgba(25, 25, 30, 0.6)` | Painéis com Glassmorphism |
| **Neon Cyan** | `#00f2ff` | Botões principais, ícones ativos |
| **Neon Purple** | `#bc13fe` | Destaques secundários, gradientes |
| **Text Primary** | `#f8f9fa` | Títulos e corpo de texto |
| **Text Secondary** | `#adb5bd` | Legendas e textos desativados |

## Efeitos Visuais

### Glassmorphism
*   **Backdrop Filter**: `blur(12px)`
*   **Border**: `1px solid rgba(255, 255, 255, 0.1)`
*   **Shadow**: `0 8px 32px 0 rgba(0, 0, 0, 0.37)`

### Typografia
*   **Primária**: Inter ou Roboto (Sans-serif moderna)
*   **Peso**: 400 (Regular), 600 (Semi-bold para títulos)

## Componentes Premium
1.  **Botões Neon**: Sombras externas com a cor do neon (`drop-shadow(0 0 5px #00f2ff)`).
2.  **Cards Flutuantes**: Transições suaves de escala ao passar o mouse.
3.  **Animações**: Micro-interações via `framer-motion` para carregamento de conteúdo.
