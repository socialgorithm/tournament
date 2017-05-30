import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Loader } from 'semantic-ui-react';

export default class Player extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.addConnectors();
  }

  addConnectors = () => {
    if (!this.props.name) {
      return;
    }

    const sourceConfig = {
      anchor: 'Continuous',
      endpoint: 'Blank',
      isSource: false,
      connector: ['Flowchart'],
      maxConnections: 10,
      isTarget: false,
      dropOptions: {
        tolerance: 'touch',
        hoverClass: 'dropHover',
        activeClass: 'dropActive',
      },
    };

    const targetConfig = {
      dropOptions: {
        hoverClass: 'dropHover',
      },
      endpoint: 'Blank',
      anchor: 'Continuous',
      isTarget: false,
    };

    this.props.jsPlumbInstance.makeSource(this.playerEl, sourceConfig);
    this.props.jsPlumbInstance.makeTarget(this.playerEl, targetConfig);
  };

  render() {
    if (!this.props.name) {
      return null;
    }

    return (
      <div
        ref={ (ref) => { this.playerEl = ref; } }
        style={ this.props.style }
        id={ this.props.id }
        className={
          classNames('game', 'game-top', { won: this.props.winner })
        }
      >
        {this.props.name}
        <span>
            <Loader inline size='mini' active={ this.props.isPlaying } />
          </span>
      </div>
    );
  }
}

// PropTypes
Player.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  winner: PropTypes.bool.isRequired,
  jsPlumbInstance: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
};
