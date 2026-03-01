# 🔊 Meme Compiler: Audio Feedback for VS Code

> Hear iconic meme sounds when your code succeeds, fails, or hits silly mistakes.

[![VS Code](https://img.shields.io/badge/VS%20Code-v1.93%2B-blue?logo=visual-studio-code)](https://code.visualstudio.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

- **16 Built-in Meme Sounds** — FAAAHH, Vine Boom, Yamete Kudasai, Bruh, and more
- **4 Sound Categories** — Error, Silly, Success, Running
- **Cross-Platform** — Windows, macOS, and Linux
- **Custom Sound Support** — Use any `.mp3` or `.wav` file
- **Smart Detection** — Exit codes + configurable keyword matching
- **No Overlapping** — One sound at a time, instant switching

---

## 🚀 Quick Start

1. Install from the VS Code Marketplace
2. Run any command in the terminal — sounds play automatically
3. Customize in `Settings → Meme Compiler`

---

## ⚙️ Settings

| Setting | Default |
|---------|---------|
| **Enabled** | `true` |
| **Error Sound** | FAAAAAHHHHH (High) |
| **Silly Sound** | Bruh |
| **Success Sound** | Anime Wow |
| **Running Sound** | Run Vine |
| **Error Keywords** | `Error:`, `Exception:`, `failed`, etc. |
| **Silly Keywords** | `undefined`, `null`, `NaN`, `SyntaxError`, etc. |

---

## 📋 Commands

| Command | Description |
|---------|-------------|
| `Meme Compiler: Play Test Sound` | Pick a category and preview |
| `Meme Compiler: Browse Custom Sound File` | Select a local `.mp3`/`.wav` |
| `Meme Compiler: Open Sounds Folder` | Open bundled sounds directory |

---

## ❓ FAQ

**Does this work with any language?**
> Yes — it monitors terminal output and exit codes. Language-agnostic.

**Does this work on Linux or macOS?**
> Yes. macOS uses `afplay` (built-in). Linux needs `mpg123` — install with `sudo apt install mpg123`.

**Sounds not playing?**
> Make sure Terminal Shell Integration is enabled: `Settings → Terminal › Shell Integration: Enabled`.

---

## 📌 Requirements

- VS Code 1.93.0+
- Terminal Shell Integration enabled

| Platform | Audio Tool | Setup |
|----------|-----------|-------|
| Windows | PowerShell | None |
| macOS | `afplay` | None |
| Linux (Ubuntu) | `mpg123` | `sudo apt install mpg123` |

---

## 📄 License

[MIT License](LICENSE) — © 2026 [SivaKanth007](https://github.com/SivaKanth007)
