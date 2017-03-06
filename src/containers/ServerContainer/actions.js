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