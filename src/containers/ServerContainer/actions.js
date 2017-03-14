import * as actions from './constants';

export function connect() {
  return {
    type: actions.CONNECT,
    payload: {},
  }
}

export function connected() {
  return {
    type: actions.CONNECTED,
    payload: {},
  }
}

export function disconnected(data) {
  return {
    type: actions.DISCONNECTED,
    payload: data,
  }
}

export function error(data) {
  return {
    type: actions.CONNECTION_ERROR,
    payload: data,
  }
}