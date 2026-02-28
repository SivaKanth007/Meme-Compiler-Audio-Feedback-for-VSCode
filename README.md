# 🔊 Meme Compiler: Audio Feedback for VS Code

> Turn your terminal into a meme soundboard. Hear iconic sounds when your code succeeds, fails, or hits silly mistakes.

[![VS Code](https://img.shields.io/badge/VS%20Code-v1.93%2B-blue?logo=visual-studio-code)](https://code.visualstudio.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

- **16 Built-in Meme Sounds** — FAAAHH, Vine Boom, Yamete Kudasai, Anime Wow, Bruh, and more
- **4 Sound Categories** — Error, Silly Mistake, Success, and Running sounds
- **Unified Dropdown Menus** — Pick any of the 16 sounds for any category from VS Code Settings
- **Custom Sound Support** — Use any `.mp3` or `.wav` file from your computer
- **Smart Detection** — Detects errors by exit code + configurable keyword matching
- **Silly Mistake Detection** — Catches `undefined`, `NaN`, `TypeError`, `SyntaxError`, etc.
- **Instant Test** — Preview any sound directly from the Settings page with one click
- **No Overlapping Audio** — Only one sound plays at a time; running sound stops instantly on completion

---

## 🚀 Quick Start

1. **Install** the extension from the VS Code Marketplace
2. **Run any command** in the terminal — sounds play automatically!
3. **Customize** (optional): `Settings → Meme Compiler` → pick sounds from dropdowns

> That's it! Default sounds work out of the box.

---

## ⚙️ Configuration

Open **Settings** (`Ctrl+,`) → search **"Meme Compiler"**

| Setting | Description | Default |
|---------|-------------|---------|
| **Enabled** | Master on/off switch | `true` |
| **Error Sound** | Plays on code errors / non-zero exit | FAAAAAHHHHH (High) 🔊 |
| **Silly Sound** | Plays on silly mistakes (undefined, NaN, etc.) | Bruh 😐 |
| **Success Sound** | Plays when code completes successfully | Anime Wow ✨ |
| **Running Sound** | Plays while code is executing | Run Vine 🏃 |
| **Error Keywords** | Terminal keywords that trigger error sound | `Error:`, `Exception:`, `failed`, etc. |
| **Silly Keywords** | Keywords that trigger silly mistake sound | `undefined`, `null`, `NaN`, `SyntaxError`, etc. |
| **Use Exit Code** | Trigger error sound on non-zero exit code | `true` |

### 🎵 Available Sounds

All 16 sounds are available in every dropdown:

| Sound | Emoji | Description |
|-------|-------|-------------|
| FAAAHH (Low) | 😱 | Classic FAAAHH meme sound (low pitch) |
| FAAAAAHHHHH (High) | 🔊 | Extended FAAAAAHHHHH meme (high pitch) |
| Vine Boom | 💥 | The iconic Vine boom sound effect |
| Exclamation | ❗ | A loud exclamation sound |
| Among Us Role Reveal | 📮 | Among Us role reveal dramatic sound |
| Anime Ahh | 😩 | Anime reaction ahh sound |
| Women Haha | 🤣 | The 'Women' meme followed by laughing |
| Bruh | 😐 | Classic 'bruh' reaction sound |
| Anime Wow | ✨ | Anime wow reaction sound |
| Click Nice | 👌 | Satisfying click 'nice' sound |
| Run Vine | 🏃 | Vine 'run' sound effect |
| Anime Punch Sad | 👊 | Anime punch with sad background |
| Nya Cat Girl | 🐱 | Cute nya cat girl sound effect |
| Strong Punch | 💪 | A powerful strong punch sound |
| Yamete Kudasai (Full) | ⚠️ | Yamete Kudasai full version |
| Yamete Kudasai (Short) | 🗣️ | Yamete Kudasai short clip |

---

## 📋 Commands

Open the Command Palette (`Ctrl+Shift+P`) and type "Meme Compiler":

| Command | Description |
|---------|-------------|
| `Meme Compiler: Play Test Sound` | Pick a category and preview that sound |
| `Meme Compiler: Browse Custom Sound File` | Select a local `.mp3`/`.wav` for any category |
| `Meme Compiler: Open Sounds Folder` | Open the bundled sounds directory |
| `Meme Compiler: Test Error Sound` | Instantly test the error sound |
| `Meme Compiler: Test Silly Sound` | Instantly test the silly sound |
| `Meme Compiler: Test Success Sound` | Instantly test the success sound |
| `Meme Compiler: Test Running Sound` | Instantly test the running sound |

---

## ❓ FAQ

**Does this work with Python / JavaScript / Java / Go / Rust / any language?**
> Yes! The extension monitors terminal output and exit codes — it's completely language-agnostic. If your code runs in the VS Code terminal, it works.

**Can I use my own sounds?**
> Absolutely. Select "Custom file..." from any sound dropdown, or use the command `Meme Compiler: Browse Custom Sound File` to pick any `.mp3` or `.wav` from your computer.

**Does this work on Linux or macOS?**
> Currently Windows only (uses PowerShell for audio playback). Cross-platform support (macOS via `afplay`, Linux via `paplay`/`aplay`) is planned for a future release.

**My sounds aren't playing — what's wrong?**
> Make sure **Terminal Shell Integration** is enabled (it's on by default in VS Code 1.93+). Go to `Settings → Terminal › Integrated › Shell Integration: Enabled` and verify it's checked.

**Do sounds overlap each other?**
> No. Only one sound plays at a time. When a new sound triggers, the previous one stops instantly.

**Can I disable it temporarily?**
> Yes — toggle `memeCompiler.enabled` to `false` in Settings, or set individual sounds to "No sound".

---

## 📌 Requirements

- **VS Code** 1.93.0 or newer
- **Terminal Shell Integration** enabled (default in recent VS Code versions)
- **Windows** (Linux and macOS support coming soon)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

Copyright © 2026 [SivaKanth007](https://github.com/SivaKanth007)
