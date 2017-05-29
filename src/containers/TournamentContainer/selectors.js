import {createSelector} from 'reselect';

const applicationsSelector = (state) => state.get('tournaments');

const getState = createSelector(
  [applicationsSelector],
  (substate) => substate.toJS()
);

export default getState;

export {
  applicationsSelector,
  getState,
};
