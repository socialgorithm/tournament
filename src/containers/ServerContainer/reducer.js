import { handleActions } from 'redux-actions';

export const initialState = {
  host: 'localhost:3141'
};

export default handleActions({
  CHANGE_SERVER: changeServer,
}, initialState);

function changeServer(state, action) {
  return state;
}
