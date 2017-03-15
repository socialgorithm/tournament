import { handleActions } from 'redux-actions';
import { Map } from 'immutable';

import * as constants from './constants';

export const initialState = Map({
  players: [],
  games: []
});

export default handleActions({
  [constants.GET_STATS]: getStats,
  [constants.UPDATE_STATS]: updateStats,
}, initialState);

function getStats(state, action) {
  return state;
}

function updateStats(state, action) {
  const update = action.payload;
  console.log('stats update', update);
  const players = state.get('players');
  switch (update.type) {
    case 'stats':
      return state.merge({
        players: update.payload.players.map((player) => (
          {
            name: player,
            online: true,
          }
        )),
        games: update.payload.games,
      });
    case 'connect':
      for (let i = 0; i < players.size; i++) {
        if (players.get(i).name === update.payload) {
          return state.merge({
            players: players.mergeIn(i, {
              online: true
            }),
          });
        }
      }
      return state.merge({
        players: players.push({
          name: update.payload,
          online: true,
        }),
      });
    case 'disconnect':
      if (!update.payload) {
        return state;
      }
      for (let i = 0; i < players.size; i++) {
        if (players.get(i).name === update.payload) {
          return state.merge({
            players: players.mergeIn(i, {
              online: false
            }),
          });
        }
      }
      return state;
    default:
      return state;
  }
}