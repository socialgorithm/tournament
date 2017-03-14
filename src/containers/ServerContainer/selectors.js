import {createSelector} from 'reselect';

const applicationsSelector = (state) => state.get('server');

const getState = createSelector(
  [applicationsSelector],
  (substate) => substate.toJS()
);

export default getState;

export {
  applicationsSelector,
  getState,
};
