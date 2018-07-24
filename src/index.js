import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import 'semantic-ui-css/semantic.css';

import App from './sections/App';
import configureStore from './store';
import './index.css';

const initialState = {};
const history = createHistory();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('root');

const app = (
  <Provider store={ store }>
    <Router history={ history }>
      <App />
    </Router>
  </Provider>
);

ReactDOM.render(
  app,
  MOUNT_NODE
);
