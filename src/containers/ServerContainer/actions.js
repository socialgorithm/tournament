import * as actions from './constants';

export function connect(host) {
  return {
    type: actions.CONNECT,
    payload: host,
  }
}

export function disconnect() {
  return {
    type: actions.DISCONNECT,
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