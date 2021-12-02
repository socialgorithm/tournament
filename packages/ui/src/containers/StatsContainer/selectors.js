import {createSelector} from 'reselect';

const applicationsSelector = (state) => state.get('stats');

const getState = createSelector(
  [applicationsSelector],
  (substate) => substate.toJS()
);

export default getState;

export {
  applicationsSelector,
  getState,
};
