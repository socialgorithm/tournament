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
            { row.map((board, boardIndex) => {
              let highlightBoard = false;
              let highlightMove = null;
              if (this.props.highlightBoard) {
                highlightBoard = this.props.highlightBoard.join(',') === [rowIndex, boardIndex].join(',');
                if (highlightBoard) {
                  highlightMove = this.props.highlightMove;
                }
              }
              return (
                <Board
                  game={ board }
                  key={ `row-${boardIndex}` }
                  highlightBoard={ highlightBoard }
                  highlightMove={ highlightMove }
                />
              );
            }) }
          </div>
        )) }
      </div>
    );
  }
}

UTTTGame.propTypes = {
  game: React.PropTypes.object,
  style: React.PropTypes.object,
  highlightBoard: React.PropTypes.array,
  highlightMove: React.PropTypes.array,
};

export default UTTTGame;
