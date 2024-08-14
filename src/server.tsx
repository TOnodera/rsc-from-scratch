import type {} from 'react/canary';
import { Readable, PassThrough } from 'stream';
// @ts-expect-error
import rsdws from 'react-server-dom-webpack/client';
const { createFromReadableStream } = rsdws;

import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { allClientComponents } from './app/client/clientComponents.js';
import React, { use } from 'react';
import ReactDOM from 'react-dom/server';
import http from 'http';
import { createServer } from 'vite';
import { LinesStream, MergedStream, RscScriptStream } from './stream.js';
import { ReadableStream } from 'stream/web';

function render() {
  const rscFile = fileURLToPath(
    new URL('./rsc.js', import.meta.url).toString(),
  );
  const proc = spawn('node', ['--conditions', 'react-server', rscFile], {
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  return proc.stdout;
}

// @ts-expect-error
globalThis.__webpack_require__ = async () => {
  return allClientComponents;
};

async function renderHTML(): Promise<ReadableStream> {
  const [stream1, stream2] = Readable.toWeb(render()).tee();
  const chunk = createFromReadableStream(stream1);

  const PageContainer: React.FC = () => {
    return (
      <html lang="ja">
        <head>
          <meta charSet="utf-8" />
        </head>
        <body>
          <div id="app">{use(chunk)}</div>
        </body>
      </html>
    );
  };
  return new Promise((resolve) => {
    const reactStream = ReactDOM.renderToPipeableStream(<PageContainer />, {
      bootstrapScriptContent: `
      globalThis.rscData = [];
      `,
      bootstrapModules: ['src/client.tsx'],
      onShellReady() {
        const rscStream = stream2
          .pipeThrough(new LinesStream())
          .pipeThrough(new RscScriptStream());

        const htmlStream = new MergedStream(
          [Readable.toWeb(reactStream.pipe(new PassThrough())), rscStream],
          0,
        );
        resolve(htmlStream as ReadableStream);
      },
    });
  });
}

const vite = await createServer();
const server = http.createServer((req, res) => {
  vite.middlewares(req, res, () => {
    renderHTML()
      .then((html) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        Readable.fromWeb(html).pipe(res);
      })
      .catch((error) => {
        console.error(error);
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end(String(error));
      });
  });
});

server.listen(8888, () => {
  console.log('start listen...');
});
