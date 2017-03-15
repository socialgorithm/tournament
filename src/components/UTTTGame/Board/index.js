import React from 'react';
import classNames from 'classnames';

import '../style.css';

class Board extends React.Component {
  render() {
    let finishedClass = '';
    if (this.props.game.isFinished()) {
      switch (this.props.game.winner) {
        case 0:
          finishedClass = 'tied';
          break;
        case 1:
          finishedClass = 'won';
          break;
        case 2:
          finishedClass = 'lost';
          break;
        default:
      }
    }
    return (
      <div className={ classNames('ttt-board', finishedClass) }>
        { this.props.game.board.map((row, rowIndex) => (
          <div className="ttt-row" key={ `row-${rowIndex}` }>
            { row.map((cell, cellIndex) => (
              <div className="ttt-cell" key={ `row-${cellIndex}` }>
                <div className={ classNames('ttt-cell-played', { 'you': cell === 1, 'opponent': cell === 2 }) }></div>
              </div>
            )) }
          </div>
        )) }
      </div>
    );
  }
}

Board.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  game: React.PropTypes.object.isRequired,
};

export default Board;
