import { connect } from 'react-redux';

import Server from '../../components/Header/Server';

import { getState } from './selectors';

const mapStateToProps = getState;

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Server);
