import React from 'react';
import { Header, Grid, Divider } from 'semantic-ui-react';

import './styles.css';

class About extends React.Component {
  render() {
    return (
      <div>
        <Header as='h1' textAlign='center'>
          Welcome to the Ultimate Tic Tac Toe Algorithm Competition!
        </Header>
        <Divider />
        <Grid columns='2'>
          <Grid.Column style={ { width: 300 } }>
            <img src="img/uttt.gif" alt="UTTT Game demo"/>
          </Grid.Column>
          <Grid.Column stretched>
            <p>
              This is the board for an Ultimate Tic Tac Toe game, it's essentially a collection of nine small regular Tic Tac Toe games.
            </p>
            <p>
              On each turn, the valid small board is highlighted in yellow. Each player's move is stored in blue/red.
            </p>
            <p>
              You'll be playing on the big board, but in order to "win" each cell, you have to win the game within that cell.
            </p>
            <p>
              The first player can play in any cell of any of the small boards. The coordinates of the move in the small board determine which board the next player has to use to play. You can read a detailed description of the rules
              <a href="https://mathwithbaddrawings.com/2013/06/16/ultimate-tic-tac-toe/">here</a>.
            </p>
            <p>
              Now, we're going to be writing an algorithm to play for us!
            </p>
          </Grid.Column>
        </Grid>

        <Divider/>

        <Header as='h2'>
          Writing your own player
        </Header>
        <p>
          We're going to write algorithms that can play this. For today they are going to be written in JavaScript, although if you want to continue in your free time you can use any language.
        </p>
        <p>
          A player needs to be able to calculate a valid move, and receive opponent moves. Every time it receives a move from its opponent it will run some calculations, and return what it considers to be the optimal move.
        </p>
        <p>
          The game server will then take the algorithms, and have them play 100-1000 times - and print out the game statistics for them.
        </p>
        <p>
          We have uploaded a <a href="https://github.com/aurbano/uabc/blob/master/sample/random.js">sample implementation of a player</a>, that chooses it's moves at random (ensuring that they are valid moves)
        </p>

        <Header as='h2'>
          Testing a player
        </Header>

        <p>
          You can pitch your player against itself, or any other valid implementation on your own computer. You'll need to install the game server first:
        </p>
        <pre>
          $ npm install -g uttt
        </pre>

        <p>
          Once you have this, you'll be able to run the following:
        </p>
        <pre>
          $ uttt --local -a path/to/playerA.js -b path/to/playerB.js
        </pre>

        <p>If everything goes well, you should see this when the games finishes:</p>
        <pre>
          Games played: 1000{'\n'}
          Winner: 0{'\n\n'}

          Player 1 wins: 504 (50%){'\n'}
          Player 2 wins: 446 (44%){'\n'}
          Ties: 50 (5%){'\n\n'}

          Player 1 timeouts: 0{'\n'}
          Player 2 timeouts: 0{'\n\n'}

          Total time: 94.37ms{'\n'}
          Avg game: 0.09ms{'\n'}
          Max game: 6.78ms{'\n'}
          Min game: 0.02ms
        </pre>

        <p>Alternatively, you can test if a player complies with the game logic by running automated tests. Just download
          <a href="https://github.com/aurbano/ultimate-ttt-server/blob/master/tests/client.test.js">this test file</a>, put it next to your player, and edit it so that the path inside of the test file points to your player.</p>
        <p>Once that is done, install <a href="https://github.com/avajs/ava">ava</a> by running <code>npm install -g ava</code>, and run <code>ava</code> in the folder that hast your player and the test file.</p>
      </div>
    );
  }
}
export default About;
