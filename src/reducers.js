/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';

import history from './utils/history';
import serverReducer from './containers/ServerContainer/reducer';
import statsReducer from './containers/StatsContainer/reducer';
import tournamentsReducer from './containers/TournamentContainer/reducer';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
 export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    server: serverReducer,
    stats: statsReducer,
    tournaments: tournamentsReducer,
    router: connectRouter(history),
    ...injectedReducers,
  });

  return rootReducer;
}