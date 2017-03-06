import React from 'react';
import UTTT from 'ultimate-ttt';

import Board from './Board';
import './style.css';

class UTTTGame extends React.Component {
  constructor(props) {
    super(props);

    this.uttt = new UTTT();
  }
  render() {
    const height = this.props.height || 300;
    const width = this.props.width || 300;

    const board = this.uttt.board;

    return (
      <div className="ttt" style={ { width, height } }>
        { board.map((row, rowIndex) => (
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
  width: React.PropTypes.number,
  height: React.PropTypes.number,
};

export default UTTTGame;
