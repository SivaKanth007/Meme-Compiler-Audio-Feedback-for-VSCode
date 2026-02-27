import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec, ChildProcess } from 'child_process';

// ===== AUDIO MANAGER =====
// Handles sound playback with stop/replace capability — no overlapping

let currentAudioProcess: ChildProcess | null = null;

/**
 * Stop whatever sound is currently playing.
 * Uses taskkill /T /F to kill the entire process tree on Windows,
 * because .kill() only kills the parent — the PowerShell child keeps playing.
 */
function stopCurrentSound() {
    if (currentAudioProcess && currentAudioProcess.pid) {
        try {
            exec(`taskkill /PID ${currentAudioProcess.pid} /T /F`, () => { });
        } catch { /* already dead */ }
        currentAudioProcess = null;
    }
}

/**
 * Play a sound file (.mp3 or .wav). Stops any currently playing sound first.
 * Uses WPF MediaPlayer which supports MP3 natively.
 * The process sleeps for 5 minutes — we kill it when we want to stop playback.
 */
function playSoundFile(filePath: string): ChildProcess | null {
    stopCurrentSound();

    // Convert to forward-slash file URI for .NET Uri class
    const fileUri = 'file:///' + filePath.replace(/\\/g, '/');
    const command = `powershell -c "Add-Type -AssemblyName presentationCore; $p = New-Object System.Windows.Media.MediaPlayer; $p.Open([Uri]'${fileUri}'); $p.Play(); Start-Sleep -Seconds 300"`;

    const proc = exec(command, (err) => {
        if (err && !err.killed) {
            console.error('[Meme Compiler] Audio playback error', err.message);
        }
        if (currentAudioProcess === proc) {
            currentAudioProcess = null;
        }
    });

    currentAudioProcess = proc;
    return proc;
}

// ===== SOUND MAP =====

const BUNDLED_SOUNDS: Record<string, string> = {
    'fahhh-low': 'Error_sounds/fahhh-low.mp3',
    'faaaahhhhhhh-high': 'Error_sounds/faaaahhhhhhh-high.mp3',
    'vine-boom': 'Error_sounds/vine-boom.mp3',
    'exclamation': 'Error_sounds/exclamation.mp3',
    'among-us-role-reveal-sound': 'Error_sounds/among-us-role-reveal-sound.mp3',
    'anime-ahh': 'Error_sounds/anime-ahh.mp3',
    'women': 'Silly_errors/women.mp3',
    'brah': 'Silly_errors/brah.mp3',
    'anime-wow-sound-effect': 'Success_sounds/anime-wow-sound-effect.mp3',
    'click-nice': 'Success_sounds/click-nice.mp3',
    'run-vine-sound-effect': 'Running_sounds/run-vine-sound-effect.mp3'
};

const SOUND_CATEGORIES = ['error', 'silly', 'success', 'running'] as const;

const executionOutputs = new Map<vscode.TerminalShellExecution, string>();

export function activate(context: vscode.ExtensionContext) {
    console.log('[Meme Compiler] Active!');

    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBar.text = '$(unmute) Meme Compiler';
    statusBar.tooltip = 'Meme Compiler — listening for terminal events';
    statusBar.show();

    const soundsDir = path.join(context.extensionPath, 'sounds');
    if (!fs.existsSync(soundsDir)) {
        fs.mkdirSync(soundsDir);
    }

    // ===== AUTO FILE PICKER on "custom" selection =====
    const configListener = vscode.workspace.onDidChangeConfiguration(async (e) => {
        for (const cat of SOUND_CATEGORIES) {
            if (e.affectsConfiguration(`memeCompiler.sounds.${cat}`)) {
                const config = vscode.workspace.getConfiguration('memeCompiler');
                const value = config.get<string>(`sounds.${cat}`);
                if (value === 'custom') {
                    const files = await vscode.window.showOpenDialog({
                        canSelectMany: false,
                        filters: { 'Audio Files': ['mp3', 'wav'] },
                        title: `Select a custom ${cat} sound file`
                    });
                    if (files && files.length > 0) {
                        context.globalState.update(`customSoundPath.${cat}`, files[0].fsPath);
                        vscode.window.showInformationMessage(`✅ ${cat} sound set to: ${path.basename(files[0].fsPath)}`);
                    } else {
                        const defaults: Record<string, string> = {
                            error: 'fahhh-low', silly: 'women',
                            success: 'anime-wow-sound-effect', running: 'run-vine-sound-effect'
                        };
                        await config.update(`sounds.${cat}`, defaults[cat], vscode.ConfigurationTarget.Global);
                    }
                }
            }
        }
    });

    // ===== COMMANDS =====

    const playTestCmd = vscode.commands.registerCommand('meme-compiler-audio.playTestSound', async () => {
        const category = await vscode.window.showQuickPick(
            [
                { label: '❌ Error', value: 'error' },
                { label: '🤪 Silly', value: 'silly' },
                { label: '✅ Success', value: 'success' },
                { label: '🏃 Running', value: 'running' }
            ],
            { placeHolder: 'Which sound to test?' }
        );
        if (!category) { return; }
        testAndPlay(category.value, context);
    });

    const testErrorCmd = vscode.commands.registerCommand('meme-compiler-audio.testError', () => testAndPlay('error', context));
    const testSillyCmd = vscode.commands.registerCommand('meme-compiler-audio.testSilly', () => testAndPlay('silly', context));
    const testSuccessCmd = vscode.commands.registerCommand('meme-compiler-audio.testSuccess', () => testAndPlay('success', context));
    const testRunningCmd = vscode.commands.registerCommand('meme-compiler-audio.testRunning', () => testAndPlay('running', context));

    const openFolderCmd = vscode.commands.registerCommand('meme-compiler-audio.openSoundsFolder', () => {
        if (!fs.existsSync(soundsDir)) { fs.mkdirSync(soundsDir, { recursive: true }); }
        vscode.env.openExternal(vscode.Uri.file(soundsDir));
    });

    const browseCmd = vscode.commands.registerCommand('meme-compiler-audio.browseCustomSound', async () => {
        const category = await vscode.window.showQuickPick(
            [
                { label: '❌ Error Sound', value: 'error' },
                { label: '🤪 Silly Sound', value: 'silly' },
                { label: '✅ Success Sound', value: 'success' },
                { label: '🏃 Running Sound', value: 'running' }
            ],
            { placeHolder: 'Which sound do you want to set?' }
        );
        if (!category) { return; }

        const files = await vscode.window.showOpenDialog({
            canSelectMany: false,
            filters: { 'Audio Files': ['mp3', 'wav'] },
            title: `Select a ${category.label} file`
        });
        if (!files || files.length === 0) { return; }

        context.globalState.update(`customSoundPath.${category.value}`, files[0].fsPath);
        const config = vscode.workspace.getConfiguration('memeCompiler');
        await config.update(`sounds.${category.value}`, 'custom', vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`${category.label} set to: ${path.basename(files[0].fsPath)}`);
    });

    // ===== TERMINAL MONITORING =====

    const startListener = vscode.window.onDidStartTerminalShellExecution(async (event) => {
        const config = vscode.workspace.getConfiguration('memeCompiler');
        if (!config.get<boolean>('enabled')) { return; }

        // Stop any lingering audio, then play running sound
        const runningSound = resolveSoundPath('running', context);
        if (runningSound) {
            playSoundFile(runningSound);
        }

        let output = '';
        try {
            for await (const chunk of event.execution.read()) {
                output += chunk;
                if (output.length > 10000) {
                    output = output.slice(-10000);
                }
            }
            executionOutputs.set(event.execution, output);
        } catch (err) {
            console.error('[Meme Compiler] Error reading terminal output', err);
        }
    });

    const endListener = vscode.window.onDidEndTerminalShellExecution(async (event) => {
        const config = vscode.workspace.getConfiguration('memeCompiler');
        if (!config.get<boolean>('enabled')) { return; }

        // STOP running sound immediately
        stopCurrentSound();

        const exitCode = event.exitCode;
        const output = (executionOutputs.get(event.execution) || '').toLowerCase();

        if (exitCode === undefined) {
            executionOutputs.delete(event.execution);
            return;
        }

        const errorKeywords = config.get<string[]>('detection.errorKeywords') || [];
        const sillyKeywords = config.get<string[]>('detection.sillyKeywords') || [];
        const useExitCode = config.get<boolean>('detection.useExitCode') !== false;

        let playType: 'success' | 'error' | 'silly' = 'success';

        for (const keyword of sillyKeywords) {
            if (output.includes(keyword.toLowerCase())) {
                playType = 'silly';
                break;
            }
        }

        if (playType !== 'silly') {
            if (useExitCode && exitCode !== 0) {
                playType = 'error';
            } else {
                for (const keyword of errorKeywords) {
                    if (output.includes(keyword.toLowerCase())) {
                        playType = 'error';
                        break;
                    }
                }
            }
        }

        console.log(`[Meme Compiler] Exit: ${exitCode} → ${playType}`);

        // Play the result sound (stops running sound first via playSoundFile)
        const soundPath = resolveSoundPath(playType, context);
        if (soundPath) {
            playSoundFile(soundPath);
        }

        executionOutputs.delete(event.execution);
    });

    context.subscriptions.push(
        playTestCmd, testErrorCmd, testSillyCmd, testSuccessCmd, testRunningCmd,
        openFolderCmd, browseCmd, configListener, startListener, endListener, statusBar
    );
}

function testAndPlay(category: string, context: vscode.ExtensionContext) {
    const soundPath = resolveSoundPath(category, context);
    if (soundPath) {
        playSoundFile(soundPath);
        vscode.window.showInformationMessage(`🔊 Playing ${category} sound...`);
    } else {
        vscode.window.showWarningMessage(`No ${category} sound configured.`);
    }
}

function resolveSoundPath(category: string, context: vscode.ExtensionContext): string | null {
    const config = vscode.workspace.getConfiguration('memeCompiler');
    const selection = config.get<string>(`sounds.${category}`) || '';

    if (selection === 'none') { return null; }

    if (selection === 'custom') {
        const customPath = context.globalState.get<string>(`customSoundPath.${category}`) || '';
        if (customPath && fs.existsSync(customPath)) { return customPath; }
        console.warn(`[Meme Compiler] Custom ${category} sound not found: ${customPath}`);
        return null;
    }

    const relPath = BUNDLED_SOUNDS[selection];
    if (relPath) {
        const fullPath = path.join(context.extensionPath, 'sounds', relPath);
        if (fs.existsSync(fullPath)) { return fullPath; }
        console.warn(`[Meme Compiler] Bundled sound not found: ${fullPath}`);
    }

    return null;
}

export function deactivate() {
    stopCurrentSound();
    executionOutputs.clear();
}
