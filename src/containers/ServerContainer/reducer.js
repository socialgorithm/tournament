import { handleActions } from 'redux-actions';
import { Map } from 'immutable';

import * as constants from './constants';

export const initialState = Map({
  host: 'localhost:3141',
  status: 'disconnected',
  error: null,
});

export default handleActions({
  [constants.CONNECT]: connect,
  [constants.DISCONNECT]: disconnect,
  [constants.CONNECTED]: connected,
  [constants.DISCONNECTED]: disconnected,
  [constants.CONNECTION_ERROR]: connectionError,
}, initialState);

function connect(state, action) {
  return state.merge({
    status: 'connecting',
    error: null,
  });
}

function disconnect(state, action) {
  return state.merge({
    status: 'disconnecting',
    error: null,
  });
}

function connected(state, action) {
  return state.merge({
    status: 'connected',
    error: null,
  });
}

function disconnected(state, action) {
  return initialState;
}

function connectionError(state, action) {
  return state.merge({
    status: 'disconnected',
    error: action.payload,
  });
}