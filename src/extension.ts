import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec, spawn, ChildProcess } from 'child_process';

// ===== AUDIO MANAGER =====

let currentProc: ChildProcess | null = null;
const isWin = process.platform === 'win32';
const isMac = process.platform === 'darwin';

function stopSound() {
    if (!currentProc?.pid) { return; }
    try {
        if (isWin) {
            exec(`taskkill /PID ${currentProc.pid} /T /F`, () => { });
        } else {
            process.kill(-currentProc.pid, 'SIGKILL');
        }
    } catch { /* already dead */ }
    currentProc = null;
}

function playSound(filePath: string): ChildProcess | null {
    stopSound();

    let command: string;
    if (isWin) {
        const uri = 'file:///' + filePath.replace(/\\/g, '/');
        command = `powershell -c "Add-Type -AssemblyName presentationCore; $p = New-Object System.Windows.Media.MediaPlayer; $p.Open([Uri]'${uri}'); $p.Play(); Start-Sleep -Seconds 300"`;
    } else if (isMac) {
        command = `afplay '${filePath.replace(/'/g, "'\\''")}'`;
    } else {
        const f = filePath.replace(/'/g, "'\\''");
        command = `mpg123 '${f}' 2>/dev/null || ffplay -nodisp -autoexit '${f}' 2>/dev/null || paplay '${f}' 2>/dev/null || aplay '${f}' 2>/dev/null`;
    }

    let proc: ChildProcess;
    if (isWin) {
        proc = exec(command, (err) => {
            if (err && !err.killed) { console.error('[Meme Compiler]', err.message); }
            if (currentProc === proc) { currentProc = null; }
        });
    } else {
        proc = spawn(command, [], { shell: true, detached: true, stdio: 'ignore' });
        proc.unref();
        proc.on('error', (err) => console.error('[Meme Compiler]', err.message));
        proc.on('exit', () => { if (currentProc === proc) { currentProc = null; } });
    }

    currentProc = proc;
    return proc;
}

// ===== SOUND CONFIG =====

const SOUNDS = [
    'fahhh-low', 'faaaahhhhhhh-high', 'vine-boom', 'exclamation',
    'among-us-role-reveal-sound', 'anime-ahh', 'women', 'brah',
    'anime-wow-sound-effect', 'click-nice', 'run-vine-sound-effect',
    'anime-punch-sad-sound-effect', 'nya-cat-girl-sound', 'strongpunch',
    'yamete-kudasai-sound-effect-full-warning', 'yamete-kudasai-sound-effect-short'
] as const;

const CATEGORIES = ['error', 'silly', 'success', 'running'] as const;
const DEFAULTS: Record<string, string> = {
    error: 'fahhh-low', silly: 'women',
    success: 'anime-wow-sound-effect', running: 'run-vine-sound-effect'
};

const outputs = new Map<vscode.TerminalShellExecution, string>();

// ===== HELPERS =====

function resolvePath(category: string, ctx: vscode.ExtensionContext): string | null {
    const sel = vscode.workspace.getConfiguration('memeCompiler').get<string>(`sounds.${category}`) || '';
    if (sel === 'none') { return null; }

    if (sel === 'custom') {
        const p = ctx.globalState.get<string>(`customSoundPath.${category}`) || '';
        return (p && fs.existsSync(p)) ? p : null;
    }

    if (SOUNDS.includes(sel as typeof SOUNDS[number])) {
        const full = path.join(ctx.extensionPath, 'sounds', `${sel}.mp3`);
        return fs.existsSync(full) ? full : null;
    }

    return null;
}

function testAndPlay(cat: string, ctx: vscode.ExtensionContext) {
    const p = resolvePath(cat, ctx);
    if (p) {
        playSound(p);
        vscode.window.showInformationMessage(`🔊 Playing ${cat} sound...`);
    } else {
        vscode.window.showWarningMessage(`No ${cat} sound configured.`);
    }
}

// ===== ACTIVATION =====

export function activate(ctx: vscode.ExtensionContext) {
    const soundsDir = path.join(ctx.extensionPath, 'sounds');
    if (!fs.existsSync(soundsDir)) { fs.mkdirSync(soundsDir); }

    // Status bar
    const bar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    bar.text = '$(unmute) Meme Compiler';
    bar.tooltip = 'Meme Compiler — listening for terminal events';
    bar.show();

    // Auto file picker on "custom" selection
    const cfgListener = vscode.workspace.onDidChangeConfiguration(async (e) => {
        for (const cat of CATEGORIES) {
            if (!e.affectsConfiguration(`memeCompiler.sounds.${cat}`)) { continue; }
            const cfg = vscode.workspace.getConfiguration('memeCompiler');
            if (cfg.get<string>(`sounds.${cat}`) !== 'custom') { continue; }

            const files = await vscode.window.showOpenDialog({
                canSelectMany: false,
                filters: { 'Audio Files': ['mp3', 'wav'] },
                title: `Select a custom ${cat} sound file`
            });
            if (files?.length) {
                ctx.globalState.update(`customSoundPath.${cat}`, files[0].fsPath);
                vscode.window.showInformationMessage(`✅ ${cat} sound set to: ${path.basename(files[0].fsPath)}`);
            } else {
                await cfg.update(`sounds.${cat}`, DEFAULTS[cat], vscode.ConfigurationTarget.Global);
            }
        }
    });

    // Commands
    const cmds = [
        vscode.commands.registerCommand('meme-compiler-audio.playTestSound', async () => {
            const pick = await vscode.window.showQuickPick(
                [
                    { label: '❌ Error', value: 'error' },
                    { label: '🤪 Silly', value: 'silly' },
                    { label: '✅ Success', value: 'success' },
                    { label: '🏃 Running', value: 'running' }
                ],
                { placeHolder: 'Which sound to test?' }
            );
            if (pick) { testAndPlay(pick.value, ctx); }
        }),
        vscode.commands.registerCommand('meme-compiler-audio.testError', () => testAndPlay('error', ctx)),
        vscode.commands.registerCommand('meme-compiler-audio.testSilly', () => testAndPlay('silly', ctx)),
        vscode.commands.registerCommand('meme-compiler-audio.testSuccess', () => testAndPlay('success', ctx)),
        vscode.commands.registerCommand('meme-compiler-audio.testRunning', () => testAndPlay('running', ctx)),
        vscode.commands.registerCommand('meme-compiler-audio.openSoundsFolder', () => {
            if (!fs.existsSync(soundsDir)) { fs.mkdirSync(soundsDir, { recursive: true }); }
            vscode.env.openExternal(vscode.Uri.file(soundsDir));
        }),
        vscode.commands.registerCommand('meme-compiler-audio.browseCustomSound', async () => {
            const pick = await vscode.window.showQuickPick(
                [
                    { label: '❌ Error Sound', value: 'error' },
                    { label: '🤪 Silly Sound', value: 'silly' },
                    { label: '✅ Success Sound', value: 'success' },
                    { label: '🏃 Running Sound', value: 'running' }
                ],
                { placeHolder: 'Which sound do you want to set?' }
            );
            if (!pick) { return; }
            const files = await vscode.window.showOpenDialog({
                canSelectMany: false,
                filters: { 'Audio Files': ['mp3', 'wav'] },
                title: `Select a ${pick.label} file`
            });
            if (!files?.length) { return; }
            ctx.globalState.update(`customSoundPath.${pick.value}`, files[0].fsPath);
            const cfg = vscode.workspace.getConfiguration('memeCompiler');
            await cfg.update(`sounds.${pick.value}`, 'custom', vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`${pick.label} set to: ${path.basename(files[0].fsPath)}`);
        })
    ];

    // Terminal monitoring
    const onStart = vscode.window.onDidStartTerminalShellExecution(async (event) => {
        const cfg = vscode.workspace.getConfiguration('memeCompiler');
        if (!cfg.get<boolean>('enabled')) { return; }

        const snd = resolvePath('running', ctx);
        if (snd) { playSound(snd); }

        let output = '';
        try {
            for await (const chunk of event.execution.read()) {
                output += chunk;
                if (output.length > 10000) { output = output.slice(-10000); }
            }
            outputs.set(event.execution, output);
        } catch (err) {
            console.error('[Meme Compiler] Terminal read error', err);
        }
    });

    const onEnd = vscode.window.onDidEndTerminalShellExecution(async (event) => {
        const cfg = vscode.workspace.getConfiguration('memeCompiler');
        if (!cfg.get<boolean>('enabled')) { return; }

        stopSound();

        const exitCode = event.exitCode;
        const output = (outputs.get(event.execution) || '').toLowerCase();
        outputs.delete(event.execution);

        if (exitCode === undefined) { return; }

        const errorKw = cfg.get<string[]>('detection.errorKeywords') || [];
        const sillyKw = cfg.get<string[]>('detection.sillyKeywords') || [];
        const useExit = cfg.get<boolean>('detection.useExitCode') !== false;

        let type: 'success' | 'error' | 'silly' = 'success';

        if (sillyKw.some(k => output.includes(k.toLowerCase()))) {
            type = 'silly';
        } else if (useExit && exitCode !== 0) {
            type = 'error';
        } else if (errorKw.some(k => output.includes(k.toLowerCase()))) {
            type = 'error';
        }

        const snd = resolvePath(type, ctx);
        if (snd) { playSound(snd); }
    });

    ctx.subscriptions.push(...cmds, cfgListener, onStart, onEnd, bar);
}

export function deactivate() {
    stopSound();
    outputs.clear();
}
