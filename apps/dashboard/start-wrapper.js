const { spawn } = require('child_process');
const path = require('path');

const port = process.env.PORT || '3000';
console.log(`[Chiro Dashboard] Booting Next.js on port ${port}...`);

const dashboardDir = path.resolve(__dirname, '../../..'); // from .next/standalone back to apps/dashboard or __dirname
const appDir = path.resolve(__dirname, '..', '..');

let targetDir = __dirname;
try {
  if (require('fs').existsSync(path.join(appDir, 'package.json'))) {
    targetDir = appDir;
  }
} catch (e) {}

const nextBin = require.resolve('next/dist/bin/next', { paths: [targetDir, __dirname, process.cwd()] });

const child = spawn(process.execPath, [nextBin, 'start', '-p', port], {
  cwd: targetDir,
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
