import { handleActions } from 'redux-actions';
import { Map } from 'immutable';
import { v4 as uuid } from 'uuid';

import * as constants from './constants';

const hosts = {
  local: 'http://localhost:3141',
  online: 'https://ultimate-ttt-server.herokuapp.com',
};

export const initialState = Map({
  host: (window.location.host.indexOf('localhost') < 0) ? hosts.online : hosts.local,
  status: 'disconnected',
  error: null,
  uuid: getUuid(),
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
    host: action.payload,
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

/**
 * Load the web id from localStorage if available
 */
function getUuid() {
  const newUuid = `web-${uuid()}`;
  const STORAGE_KEY = 'uuid';
  if (!storageAvailable('localStorage')) {
    return newUuid;
  }
  const storedUuid = localStorage.getItem(STORAGE_KEY);
  if (storedUuid) {
    return storedUuid;
  }
  localStorage.setItem(STORAGE_KEY, newUuid);
  return newUuid;
};

function storageAvailable(type) {
  try {
      var storage = window[type],
          x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
  }
  catch(e) {
      return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          storage.length !== 0;
  }
}