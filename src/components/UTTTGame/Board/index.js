import React from 'react';

import '../style.css';

class Board extends React.Component {
  render() {
    return (
      <div className="ttt-board">
        { this.props.game.board.map((row, rowIndex) => (
          <div className="ttt-row" key={ `row-${rowIndex}` }>
            { row.map((cell, cellIndex) => (
              <div className="ttt-cell" key={ `row-${cellIndex}` }>
                { cell }
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
