import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import '../style.css';

class Board extends React.Component {
  render() {
    let finishedClass = '';
    if (this.props.game.isFinished()) {
      switch (this.props.game.winner) {
        case -1:
          finishedClass = 'tied';
          break;
        case 0:
          finishedClass = 'won';
          break;
        case 1:
          finishedClass = 'lost';
          break;
        default:
      }
    }
    return (
      <div className={ classNames('ttt-board', finishedClass, { active: this.props.highlightBoard }) }>
        { this.props.game.board.map((row, rowIndex) => (
          <div className={ classNames('ttt-row') } key={ `row-${rowIndex}` }>
            { row.map((cell, cellIndex) => {
              let highlight = false;
              if (this.props.highlightMove) {
                highlight = this.props.highlightMove.join(',') === [rowIndex, cellIndex].join(',');
              }
              if (cell.mainIndex && this.props.lastMove <= cell.mainIndex) {
                return (
                  <div className={ classNames('ttt-cell') } key={ `row-${cellIndex}` }>
                    <div className='ttt-cell-played'></div>
                  </div>
                );
              }
              return (
                <div className={ classNames('ttt-cell', { active: highlight }) } key={ `row-${cellIndex}` }>
                  <div className={ classNames('ttt-cell-played', { 'you': cell.player === 0, 'opponent': cell.player === 1 }) }>
                    { cell.mainIndex >= 0 ? cell.mainIndex + 1 : '' }
                  </div>
                </div>
              );
            }) }
          </div>
        )) }
      </div>
    );
  }
}

Board.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  game: PropTypes.object.isRequired,
  lastMove: PropTypes.number,
  highlightBoard: PropTypes.boolean,
  highlightMove: PropTypes.array,
};

export default Board;
