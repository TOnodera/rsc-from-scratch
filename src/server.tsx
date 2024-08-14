import type {} from 'react/canary';
import { Readable, PassThrough } from 'stream';
import { writeFile } from 'fs/promises';
// @ts-expect-error
import rsdws from 'react-server-dom-webpack/client';
const { createFromReadableStream } = rsdws;

import { App } from './app/server/App.js';
import { bundlerConfig } from './app/server/Client.js';
import { fileURLToPath } from 'url';
import { StringDecoder } from 'string_decoder';
import { spawn } from 'child_process';
import { allClientComponents } from './app/client/clientComponents.js';
import React, { use } from 'react';
import ReactDOM from 'react-dom/server';
import { createWriteStream } from 'fs';

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

async function renderHTML(): Promise<Readable> {
  const [stream1, stream2] = Readable.toWeb(render()).tee();
  const chunk = createFromReadableStream(stream1);
  const rscData = await readAll(stream2 as ReadableStream<Uint8Array>);

  const PageContainer: React.FC = () => {
    return (
      <html lang="ja">
        <head>
          <meta charSet="utf-8" />
        </head>
        <body>
          <div id="app">{use(chunk)}</div>
          <script id="rsc-data" data-data={rscData} />
        </body>
      </html>
    );
  };
  const htmlStream = ReactDOM.renderToPipeableStream(<PageContainer />, {
    bootstrapModules: ['src/client.tsx'],
  }).pipe(new PassThrough());

  return htmlStream;
}

async function readAll(stream: ReadableStream<Uint8Array>): Promise<string> {
  let result = '';
  const decoder = new TextDecoder();
  for await (const chunk of stream) {
    result += decoder.decode(chunk);
  }
  return result;
}

renderHTML().then(async (html) => {
  const file = createWriteStream('./index.html');
  html.pipe(file);
});
