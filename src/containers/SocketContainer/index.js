import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Socket from '../../components/Socket';

import { getState } from '../ServerContainer/selectors';
import * as actions from '../ServerContainer/actions';

const mapStateToProps = getState;

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Socket);
