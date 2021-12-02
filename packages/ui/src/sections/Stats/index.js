import React from 'react';
import PropTypes from 'prop-types';
import { Header, Grid, List, Label, Container } from 'semantic-ui-react';

class Stats extends React.Component {
  render() {
    return (
      <Container>
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
      </Container>
    );
  }
}

Stats.propTypes = {
  players: PropTypes.array.isRequired,
  games: PropTypes.array.isRequired,
};

export default Stats;