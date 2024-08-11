import { fileURLToPath } from 'url';

const appDir = new URL('./src', import.meta.url);
const buildDir = new URL('./build', import.meta.url);

export function resolveApp(path: string = '') {
  return fileURLToPath(new URL(path, appDir));
}

export function resolveBuild(path: string = '') {
  return fileURLToPath(new URL(path, buildDir));
}
