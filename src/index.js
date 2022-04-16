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
    [Localhost.chainId]: 'http://161.81.156.141:7545/',
  },
}

ReactDOM.render(
  <DAppProvider config={config}>
    <App />
  </DAppProvider>,
  document.getElementById('root')
);
