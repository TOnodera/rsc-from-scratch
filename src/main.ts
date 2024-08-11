import express, { Request, Response } from 'express';
import { build as esbuild } from 'esbuild';
import { resolveApp, resolveBuild } from './utils';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.json({ hello: 'world' });
});

async function build() {
  await esbuild({
    bundle: true,
    format: 'esm',
    logLevel: 'error',
    entryPoints: [resolveApp('pages/index.jsx')],
    outdir: resolveBuild(),
    packages: 'external',
  });
}

app.listen(3000, async () => {
  await build();
  console.log('start listening...');
});
