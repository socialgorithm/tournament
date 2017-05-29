import { handleActions } from 'redux-actions';
import { Map } from 'immutable';

import * as constants from './constants';

const gameStatuses = {
  NOT_STARTED: 0,
  IN_PROGRESS: 1,
  FINISHED: 2
};

const round1Game1 = {
  playerA: "player1",
  playerB: "player2",
  winner: "player2",
  result: gameStatuses.FINISHED
};

const round1Game2 = {
  playerA: "player3",
  playerB: "player4",
  winner: "player3",
  result: gameStatuses.FINISHED
};

const round1Game3 = {
  playerA: "player5",
  playerB: "player6",
  winner: "player5",
  result: gameStatuses.FINISHED
};
const round1Game4 = {
  playerA: "player7",
  playerB: "player8",
  winner: "player7",
  result: gameStatuses.FINISHED
};

const round2Game1 = {
  playerA: "player2",
  playerB: "player3",
  winner: "player2",
  result: gameStatuses.FINISHED
};

const round2Game2 = {
  playerA: "player5",
  playerB: "player7",
  winner: "player5",
  result: gameStatuses.FINISHED
};

const round3Game1 = {
  playerA: "player2",
  playerB: "player5",
  winner: null,
  result: gameStatuses.IN_PROGRESS
};

const round1 = {
  games: [round1Game1, round1Game2, round1Game3, round1Game4]
};

const round2 = {
  games: [round2Game1, round2Game2]
};

const round3 = {
  games: [round3Game1]
};

const tournament = {
  rounds: [round1, round2, round3]
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
  console.log('tournaments update', update);
  switch (update.type) {
    case 'tournaments':
      return Object.assign({}, state, update.tournament);
    default:
      return state;
  }
}