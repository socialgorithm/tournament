import { handleActions } from 'redux-actions';

import * as actions from './actions';

export const initialState = {
  host: 'localhost:3141',
  status: 'disconnected',
  error: null,
};

export default handleActions({
  [actions.CONNECT]: connect,
  [actions.CONNECTED]: connected,
}, initialState);

function connect(state, action) {
  console.log('Connecting...');
  const newState = state;
  newState.status = 'connecting';
  newState.error = null;

  return newState;
}

function connected(state, action) {
  console.log('Connected!');
  const newState = state;
  newState.status = 'connected';
  newState.error = null;

  return newState;
}