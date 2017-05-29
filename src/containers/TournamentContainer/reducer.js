import { handleActions } from 'redux-actions';
import { Map } from 'immutable';

import * as constants from './constants';

const gameStatuses = {
  NOT_STARTED: 0,
  IN_PROGRESS: 1,
  FINISHED: 2
};

const initialGame = {
  playerA: "playerA",
  playerB: "playerB",
  winner: null,
  result: gameStatuses.IN_PROGRESS
};

const initialGame1 = {
  playerA: "playerA",
  playerB: "playerB",
  winner: "playerB",
  result: gameStatuses.FINISHED
};

const initialGame2 = {
  playerA: "playerC",
  playerB: "playerB",
  winner: "playerC",
  result: gameStatuses.FINISHED
};

const isRoundFinished = (round) => round.games.every(game => game.result === gameStatuses.FINISHED);


const initialRound = {
  games: [initialGame, initialGame1]
};

const initialRound1 = {
  games: [initialGame2]
};

const tournament = {
  rounds: [initialRound, initialRound1]
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