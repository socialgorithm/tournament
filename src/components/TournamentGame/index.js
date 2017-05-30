import React from 'react';
import PropTypes from 'prop-types';

import './index.css';
import Connection from './Connection/index';
import Player from './Player/index';

class TournamentGame extends React.Component {
  getId = (round, game, player) => `R${round}-G${game}-P${player}`;

  render() {
    const nextRound = this.props.roundIndex + 1;
    const nextGame = Math.floor(this.props.gameIndex / 2);
    const nextPlayer = (Math.round(this.props.gameIndex / 2) === nextGame) ? 0 : 1;

    let gameMargin = 0;
    let playerAMarginTop = 0;
    let playerBMarginTop = 0;
    if (this.props.roundIndex > 0) {
      gameMargin = Math.pow(this.props.roundIndex, 2) * 15;
      playerAMarginTop = this.props.roundIndex * 10;
      playerBMarginTop = this.props.roundIndex * 73;
    }

    return (
      <div className='game-pair' style={ { marginTop: gameMargin, marginBottom: gameMargin } }>
        <Player
          id={ this.getId(this.props.roundIndex, this.props.gameIndex, 0) }
          style={ { marginTop: playerAMarginTop } }
          winner={ this.props.game.playerA === this.props.game.winner }
          name={ this.props.game.playerA }
          jsPlumbInstance={ this.props.jsPlumbInstance }
        />
        <Player
          id={ this.getId(this.props.roundIndex, this.props.gameIndex, 1) }
          style={ { marginTop: playerBMarginTop } }
          winner={ this.props.game.playerB === this.props.game.winner }
          name={ this.props.game.playerB }
          jsPlumbInstance={ this.props.jsPlumbInstance }
        />
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
  isPlaying: PropTypes.bool.isRequired,
  roundIndex: PropTypes.number.isRequired,
  jsPlumbInstance: PropTypes.object.isRequired,
};

export default TournamentGame;
