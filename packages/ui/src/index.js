import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router/immutable';
import Immutable from 'immutable';
import history from './utils/history';

import 'semantic-ui-css/semantic.css';

import App from './sections/App';
import configureStore from './store';
import './index.scss';

const initialState = Immutable.Map();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('root');

ReactDOM.render(
  <Provider store={ store }>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  MOUNT_NODE
);
