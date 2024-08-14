import React from 'react';
import { Page } from '../Page.js';
import { Client } from './Client.js';
import { Uhyo } from './Uhyo.js';

export const App: React.FC = () => {
  return (
    <Page>
      <p>Hello world</p>
      <Uhyo />
      <Client.Clock />
    </Page>
  );
};
