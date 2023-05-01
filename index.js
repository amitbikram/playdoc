import './style.css';
import 'xterm/css/xterm.css';
import { WebContainer } from '@webcontainer/api';
import { Terminal } from 'xterm'
import { files } from './files';

// window.WEBCONTAINER_API_IFRAME_URL = "http://localhost:3111/";

let webcontainerInstance;

const iframeEl = document.querySelector('iframe');
const terminalEl = document.querySelector('.terminal');

window.addEventListener('load', async () => {
    const terminal = new Terminal({
        convertEol: true,
    });
    terminal.open(terminalEl);

    webcontainerInstance = await WebContainer.boot();
    await webcontainerInstance.mount(files);
    const exitCode = await installDependencies(terminal);
    if (exitCode !== 0) {
        throw new Error('Installation failed');
    };
    startDevServer(terminal);
});

async function installDependencies(terminal) {
    // Install dependencies
    const installProcess = await webcontainerInstance.spawn('npm', ['install']);
    // Wait for install command to exit
    installProcess.output.pipeTo(new WritableStream({
        write(data) {
            terminal.write(data);
        }
    }));
    return installProcess.exit;
}

async function startDevServer(terminal) {
    // Run `npm run start` to start the Express app
    const serverProcess = await webcontainerInstance.spawn('npm', ['run', 'start']);

    serverProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data);
          },
        })
    );

    // Wait for `server-ready` event
    webcontainerInstance.on('server-ready', (port, url) => {
        iframeEl.src = url;
    });
}