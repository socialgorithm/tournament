import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Server from '../../sections/Tournaments';

import { getState } from './selectors';
import * as actions from './actions';

const mapStateToProps = getState;

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Server);
