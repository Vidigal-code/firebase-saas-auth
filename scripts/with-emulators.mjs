// Runs a command inside `firebase emulators:exec` and makes sure the emulator
// processes are gone afterwards: on Windows the CLI exits without killing the
// Firestore JVM, which leaves the port taken for the next run.
// Usage: node scripts/with-emulators.mjs <services> "<command>"   e.g. firestore,auth "vitest run"
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const TEST_PROJECT_ID = 'demo-broadcast';
const FIREBASE_CLI = join(ROOT_DIR, 'node_modules', 'firebase-tools', 'lib', 'bin', 'firebase.js');
const EMULATORS = JSON.parse(readFileSync(join(ROOT_DIR, 'firebase.json'), 'utf8')).emulators;
const WINDOWS_SYSTEM_DIR = join(process.env.SystemRoot ?? String.raw`C:\Windows`, 'System32');
const NETSTAT = join(WINDOWS_SYSTEM_DIR, 'netstat.exe');
const TASKKILL = join(WINDOWS_SYSTEM_DIR, 'taskkill.exe');

const findWindowsListenerPids = (ports) =>
  execFileSync(NETSTAT, ['-ano', '-p', 'tcp'], { encoding: 'utf8' })
    .split(/\r?\n/)
    .filter((line) => line.includes('LISTENING') && ports.some((port) => line.includes(`:${port} `)))
    .map((line) => line.trim().split(/\s+/).at(-1));

const stopOrphanEmulators = (services) => {
  if (process.platform !== 'win32') return;
  const ports = services.map((service) => EMULATORS[service]?.port).filter(Boolean);
  new Set(findWindowsListenerPids(ports)).forEach((pid) =>
    spawnSync(TASKKILL, ['/PID', pid, '/T', '/F'], { stdio: 'ignore' }),
  );
};

const [servicesArg, command] = process.argv.slice(2);
if (!servicesArg || !command) {
  console.error('Usage: node scripts/with-emulators.mjs <services> "<command>"');
  process.exit(1);
}

const services = servicesArg.split(',');
// The pinned firebase-tools devDependency runs through the current Node binary, so no PATH lookup is involved.
const result = spawnSync(
  process.execPath,
  [FIREBASE_CLI, 'emulators:exec', '--only', servicesArg, '--project', TEST_PROJECT_ID, command],
  { cwd: process.cwd(), stdio: 'inherit' },
);
stopOrphanEmulators(services);
process.exit(result.status ?? 1);
