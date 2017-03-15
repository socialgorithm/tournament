import React from 'react';
import UTTT from 'ultimate-ttt';

import Board from './Board';
import './style.css';

class UTTTGame extends React.Component {
  render() {
    const game = this.props.game || new UTTT();

    return (
      <div className="ttt" style={ this.props.style }>
        { game.board.map((row, rowIndex) => (
          <div className="ttt-board-row" key={ `row-${rowIndex}` }>
            { row.map((board, boardIndex) => (
              <Board game={ board } key={ `row-${boardIndex}` } />
            )) }
          </div>
        )) }
      </div>
    );
  }
}

UTTTGame.propTypes = {
  game: React.PropTypes.object,
  style: React.PropTypes.object,
};

export default UTTTGame;
