// @ts-expect-error
import rsdws from 'react-server-dom-webpack/server';
const { renderToPipeableStream } = rsdws;
import { App } from './app/App.js';
import { bundlerConfig } from './app/server/Client.js';

renderToPipeableStream(<App />, bundlerConfig).pipe(process.stdout);
