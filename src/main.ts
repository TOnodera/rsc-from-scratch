import express, { Request, Response } from 'express';
import { build as esbuild } from 'esbuild';
import { resolveApp, resolveBuild } from './utils';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';

const app = express();

app.get('/', async (req: Request, res: Response) => {
  const Page = await import('./build/index.js');
  const html = renderToString(createElement(Page.default));
  res.send(html);
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
