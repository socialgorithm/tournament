import * as actions from './constants';

export function getStats() {
  return {
    type: actions.GET_STATS,
    payload: null,
  }
}

export function updateStats(stats) {
  return {
    type: actions.UPDATE_STATS,
    payload: stats,
  }
}