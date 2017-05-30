import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from 'semantic-ui-react';
import UTTT from '@socialgorithm/ultimate-ttt';
import Slider from 'rc-slider';

import Board from './Board';
import './style.css';
import 'rc-slider/assets/index.css';

class UTTTGame extends React.Component {
  constructor(props) {
    super(props);

    this.replayInterval = null;

    this.state = {
      lastMove: (props.game) ? props.game.moves : 0,
      isReplaying: false,
    };
  }

  updateSelection = (val) => {
    this.setState({
      lastMove: val
    });
  };

  replay = () => {
    if (!this.props.game) {
      return;
    }
    if (this.state.isReplaying) {
      this.pauseReplaying();
      return;
    }
    if (this.state.lastMove >= this.props.game.moves) {
      this.setState({
        lastMove: 0,
      });
    }
    this.pauseReplaying();
    this.setState({
      isReplaying: true,
    });
    this.replayInterval = setInterval(() => {
      this.updateSelection(this.state.lastMove + 1);
      if (this.state.lastMove >= this.props.game.moves) {
        this.pauseReplaying();
      }
    }, 300);
  };

  pauseReplaying = () => {
    clearInterval(this.replayInterval);
    this.setState({
      isReplaying: false,
    });
  };

  render() {
    const game = this.props.game || new UTTT();

    return (
      <div>
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
                    lastMove={ this.state.lastMove }
                    highlightBoard={ highlightBoard }
                    highlightMove={ highlightMove }
                  />
                );
              }) }
            </div>
          )) }
        </div>
        <Grid>
          <Grid.Column width={ 4 }>
            <Button
              size='tiny'
              icon={ (this.state.isReplaying) ? 'pause' : 'play' }
              onClick={ this.replay }
            />
          </Grid.Column>
          <Grid.Column width={ 12 }>
            <Slider
              min={ 0 }
              max={ game.moves }
              step={ 1 }
              value={ this.state.lastMove }
              onChange={ this.updateSelection }
            />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

UTTTGame.propTypes = {
  game: PropTypes.object,
  style: PropTypes.object,
  currentMove: PropTypes.number,
  highlightBoard: PropTypes.array,
  highlightMove: PropTypes.array,
};

export default UTTTGame;
