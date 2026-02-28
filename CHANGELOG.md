# Changelog

All notable changes to **Meme Compiler: Audio Feedback for VS Code** will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/).

---

## [0.0.3] — 2026-02-28

### Added
- 5 new meme sounds: Anime Punch Sad, Nya Cat Girl, Strong Punch, Yamete Kudasai (Full), Yamete Kudasai (Short)
- All 16 sounds now available in every dropdown (error, silly, success, running)
- FAQ section in README
- Proper license section in README
- Full sound catalog in README with descriptions

### Changed
- Flattened sound folder structure — all audio files are now in a single `sounds/` directory (no subfolders)
- Unified all 4 dropdown menus to show the complete sound library
- Test button in settings now appears as a highlighted button on its own line instead of inline text
- Completely overhauled README with professional layout, configuration tables, and command reference

### Removed
- Sound subfolders (`Error_sounds/`, `Silly_errors/`, `Success_sounds/`, `Running_sounds/`)
- "Known Issues" section from README (issues resolved)
- "Inspiration" section from README

---

## [0.0.2] — 2026-02-27

### Fixed
- Audio sync: sounds no longer overlap — new sounds stop the previous one instantly
- Running sound stops immediately when program fails or finishes
- Error/silly sounds now interrupt running sound correctly

### Changed
- Replaced `sound-play` with WPF `MediaPlayer` for reliable audio playback
- Added `taskkill /T /F` for proper process tree cleanup on Windows

---

## [0.0.1] — 2026-02-27

### Added
- Initial release
- 11 built-in meme sounds across 4 categories (Error, Silly, Success, Running)
- Dropdown sound selection in VS Code Settings
- Custom sound file support (.mp3/.wav)
- Smart error detection via exit codes and configurable keywords
- Silly mistake detection (undefined, null, NaN, TypeError, etc.)
- Test sound commands in Command Palette
- Status bar indicator