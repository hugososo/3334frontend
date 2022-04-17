import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
  DAppProvider,
  Localhost,
} from '@usedapp/core';

const config = {
  readOnlyChainId: Localhost.chainId,
  readOnlyUrls: {
    [Localhost.chainId]: 'https://kayan9896.com',
  },
}

ReactDOM.render(
  <DAppProvider config={config}>
    <App />
  </DAppProvider>,
  document.getElementById('root')
);
