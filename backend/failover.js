import http from 'http';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const mainServerUrl = 'http://localhost:5000/health';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backupServerScript = path.join(__dirname, 'backupServer.js');

let mainServerStatus = 'unknown';
let backupProcess = null;

function checkMainServer() {
    http.get(mainServerUrl, (res) => {
        if (res.statusCode === 200) {
            console.log('Main Server is up');
            mainServerStatus = 'up';
            if (backupProcess) {
                backupProcess.kill();
                backupProcess = null;
            }
        } else {
            console.log('Main Server is down');
            mainServerStatus = 'down';
            startBackupServer();
        }
    }).on('error', (err) => {
        console.log('Main Server is down', err.message);
        mainServerStatus = 'down';
        startBackupServer();
    });
}

function startBackupServer() {
    if (!backupProcess) {
        console.log('Starting Backup Server...');
        backupProcess = spawn('node', [backupServerScript], { stdio: 'inherit' });

        backupProcess.on('close', (code) => {
            console.log(`Backup Server exited with code ${code}`);
            backupProcess = null;
        });
    }
}

setInterval(checkMainServer, 10000); // Check every 10 seconds
