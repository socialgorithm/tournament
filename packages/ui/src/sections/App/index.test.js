import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router/immutable';
import Immutable from 'immutable';

import history from '../../utils/history';
import configureStore from '../../store';

const initialState = Immutable.Map();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('root');

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={ store }>
      <ConnectedRouter history={history}>
          <App />
      </ConnectedRouter>
    </Provider>, div);
});
