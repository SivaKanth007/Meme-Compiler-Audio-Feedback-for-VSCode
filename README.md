# Meme Compiler: Audio Feedback for VS Code

Bring your code execution to life with meme sounds! Play sounds on success, error, or "silly mistakes" (common developer errors).

## Features

- 🔊 **Instant Audio Feedback**: Hear meme sounds when your terminal commands succeed, fail, or hit silly mistakes.
- 🎵 **3 Built-in Sounds**: FAAAHH, Exclamation, and Women Haha — ready to go, no setup needed.
- 🎛️ **Easy Configuration**: Pick sounds from a dropdown menu in VS Code Settings — no file editing required.
- 📁 **Custom Sounds**: Use any .mp3 or .wav file from your computer.
- 🔍 **Smart Detection**: Detects errors by exit code and configurable keywords.

## How to Set Up

1. Install the extension.
2. That's it! Default sounds play automatically.
3. To customize: **Settings → Meme Compiler** → pick sounds from the dropdowns.

## Changing Sounds

### Option 1: Settings Dropdown
Go to **Settings** (Ctrl+,) → search "Meme Compiler" → use the dropdown menus:

- **Error Sound**: FAAAHH 😱 / Exclamation ❗ / Women Haha 🤣 / Custom
- **Silly Sound**: Same options
- **Success Sound**: Same options

### Option 2: Browse Custom File
Command Palette (Ctrl+Shift+P) → **"Meme Compiler: Browse Custom Sound File"** → pick a category → select any .mp3/.wav from your PC.

## Commands

| Command | Description |
|---------|-------------|
| `Meme Compiler: Play Test Sound` | Test your current error sound |
| `Meme Compiler: Open Sounds Folder` | Open the bundled sounds directory |
| `Meme Compiler: Browse Custom Sound File` | Pick a local audio file for any category |

## Requirements

- VS Code 1.93.0 or newer
- **Terminal Shell Integration** enabled (default in recent VS Code)

## Known Issues

- Sound playback uses `sound-play` (PowerShell on Windows, `afplay` on macOS). Linux not supported yet.
- Shell integration must be active for terminal detection to work.

## Inspiration

Inspired by the [Faaaaaahhh](https://marketplace.visualstudio.com/items?itemName=tanmoy-debnath.faaaaaahhh) extension.
