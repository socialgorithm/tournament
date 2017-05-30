import { handleActions } from 'redux-actions';
import { Map } from 'immutable';

import * as constants from './constants';

const tournament = {
  players: {},
  started: false,
};

export const initialState = Map(tournament);

export default handleActions({
  [constants.GET_TOURNAMENTS]: getTournaments,
  [constants.UPDATE_TOURNAMENTS]: updateTournaments,
}, initialState);

function getTournaments(state, action) {
  return state;
}

function updateTournaments(state, action) {
  const update = action.payload;
  console.log('tournaments update', update.payload);
  switch (update.type) {
    case 'stats':
      return Map(update.payload);
    default:
      return state;
  }
}