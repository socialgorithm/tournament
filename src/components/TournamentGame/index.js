import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './index.css';
import Connection from './Connection/index';

class TournamentGame extends React.Component {

  componentDidMount() {
    this.addConnectors();
  }

  getId = (round, game, player) => `R${round}-G${game}-P${player}`;

  addConnectors = () => {

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

    this.props.jsPlumbInstance.makeSource(this.gameA, sourceConfig);
    this.props.jsPlumbInstance.makeTarget(this.gameA, targetConfig);

    this.props.jsPlumbInstance.makeSource(this.gameB, sourceConfig);
    this.props.jsPlumbInstance.makeTarget(this.gameB, targetConfig);
    this.props.jsPlumbInstance.addEndpoint(this.gameA, {

    });
  };

  render() {
    const nextRound = this.props.roundIndex + 1;
    const nextGame = Math.floor(this.props.gameIndex / 2);
    const nextPlayer = (Math.round(this.props.gameIndex / 2) === nextGame) ? 0 : 1;

    return (
      <div className='game-pair'>
        <div
          ref={ (ref) => { this.gameA = ref; } }
          id={ this.getId(this.props.roundIndex, this.props.gameIndex, 0) }
          className={
            classNames('game', 'game-top', {winner: this.props.game.playerA === this.props.game.winner })
          }
        >
          {this.props.game.playerA}
        </div>
        <div
          ref={ (ref) => { this.gameB = ref; } }
          id={ this.getId(this.props.roundIndex, this.props.gameIndex, 1) }
          className={
            classNames('game', 'game-bottom', {winner: this.props.game.playerB === this.props.game.winner })
          }
        >
          {this.props.game.playerB}
        </div>
        <Connection
          jsPlumbInstance={ this.props.jsPlumbInstance }
          sourceId={ this.getId(this.props.roundIndex, this.props.gameIndex, 0) }
          targetId={ this.getId(nextRound, nextGame, nextPlayer) }
          winner={ this.props.game.playerA === this.props.game.winner }
        />
        <Connection
          jsPlumbInstance={ this.props.jsPlumbInstance }
          sourceId={ this.getId(this.props.roundIndex, this.props.gameIndex, 1) }
          targetId={ this.getId(nextRound, nextGame, nextPlayer) }
          winner={ this.props.game.playerB === this.props.game.winner }
        />
      </div>
    );
  }
}

TournamentGame.PropTypes = {
  game: PropTypes.object.isRequired,
  gameIndex: PropTypes.number.isRequired,
  roundIndex: PropTypes.number.isRequired,
  jsPlumbInstance: PropTypes.object.isRequired,
};

export default TournamentGame;
