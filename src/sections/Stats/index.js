import React from 'react';
import { Header, Grid, List, Label } from 'semantic-ui-react';

class Stats extends React.Component {
  render() {
    return (
      <div>
        <Grid divided>
          <Grid.Column width={ 4 }>
            <Header>Players</Header>
            <List divided relaxed>
              { this.props.players.map((player, $index) => (
                <List.Item key={ $index }>
                  <Label circular color={ (player.online)? 'green' : 'red' } empty style={ {marginRight: '10px'} }/>
                  { player.name }
                </List.Item>
              )) }
            </List>
          </Grid.Column>
          <Grid.Column>
            <Header>Games</Header>
            <ul>
              { this.props.games.map((game, $index) => (
                <li key={ $index }>{ game }</li>
              )) }
            </ul>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

Stats.propTypes = {
  players: React.PropTypes.array.isRequired,
  games: React.PropTypes.array.isRequired,
};

export default Stats;