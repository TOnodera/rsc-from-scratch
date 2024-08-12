import React from 'react';
import { Page } from './Page.js';
import { Client } from './server/Client.js';

export const App: React.FC = () => {
  return (
    <Page>
      <p>Hello world</p>
      <Client.Clock />
    </Page>
  );
};
