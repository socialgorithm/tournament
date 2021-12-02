import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

export default class Connection extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    setTimeout(() => {
      this.connection = this.props.jsPlumbInstance.connect({
        source: this.props.sourceId,
        target: this.props.targetId,
        anchors:["Right", "Left" ],
        endpoint: 'Blank',
        paintStyle: {
          strokeWidth: 2,
          outlineStroke: 'transparent',
          outlineWidth: 10,
        },
        label: null,
      });
    }, 100);
  }

  componentDidUpdate() {
    if (!this.props.winner) {
      this.connection.removeClass('winner');
    } else {
      this.connection.addClass('winner');
    }
  }

  componentWillUnmount() {
    try {
      this.props.jsPlumbInstance.detach(this.connection);
    } catch (ignored) {
      // this will typically throw an exception, as the tier is removed before
      // which removes all connections
    }
  }

  render() { return null; }
}

// PropTypes
Connection.propTypes = {
  sourceId: PropTypes.string.isRequired,
  targetId: PropTypes.string.isRequired,
  winner: PropTypes.bool.isRequired,
  jsPlumbInstance: PropTypes.object.isRequired,
};
