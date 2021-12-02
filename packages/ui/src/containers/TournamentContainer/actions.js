import * as actions from './constants';

export function getTournaments() {
  return {
    type: actions.GET_TOURNAMENTS,
    payload: null,
  }
}

export function updateTournaments(tournaments) {
  return {
    type: actions.UPDATE_TOURNAMENTS,
    payload: tournaments,
  }
}