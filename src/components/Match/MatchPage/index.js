import React from "react";
import {
  Icon,
  Container,
  Grid,
  Label,
  Message,
  Button
} from "semantic-ui-react";
import FlipMove from 'react-flip-move';

import DoubleElimination from './types/DoubleElimination';
import FreeForAll from './types/FreeForAll';

import './index.css';

export default class MatchPage extends React.PureComponent {
  
  renderTournamentLabel() {
    let state = "Waiting...";
    let color = null;
    if (this.props.tournament.finished) {
      state = "Completed";
      color = "green";
    } else if (this.props.tournament.started) {
      state = "In Progress";
      color = "orange";
    }
    return <Label color={color} content={state} />;
  }

  renderRanking() {
    return (
      <div className='ranking'>
        <h2>Ranking</h2>
        <FlipMove>
          {this.props.tournament.ranking.map((player, $index) => (
            <div key={ player } className='player'>
              <div className='rank'>{ $index + 1}</div>
              <div className='name'>{ player }</div>
            </div>
          ))}
        </FlipMove>
      </div>
    );
  }

  renderTournament() {
    let TournamentRenderer;
    switch (this.props.tournament.options.type) {
      case 'FreeForAll':
        TournamentRenderer = FreeForAll;
        break;
      case 'DoubleElimination':
        TournamentRenderer = DoubleElimination;
        break;
      default:
        return (
          <Message warning>
            Invalid Tournament Type "{this.props.tournament.options.type}"
          </Message>
        );

    }
    return (
      <TournamentRenderer
        tournament={ this.props.tournament }
      />
    );
  }

  renderContinueButton() {
    const disabled = !this.props.tournament.waiting;
    return (
      <Button
        icon='play'
        content={this.props.tournament.matches.length > 0 ? 'Play Next Match' : 'Start Tournament'}
        onClick={this.props.continueMatches}
        disabled={ disabled }
        size='tiny'
        primary
      />
    );
  }

  render() {
    return (
      <Container fluid>
        <Grid columns={ 3 }>
          <Grid.Column>
            <Button
              icon='chevron left'
              content='Lobby'
              onClick={this.props.backToLobby}
              basic
            />
          </Grid.Column>
          <Grid.Column>
          <h1>
            <Icon name='game' /> Tournament
          </h1>
          </Grid.Column>
          <Grid.Column textAlign='right'>
              { this.renderContinueButton() }
              { this.renderTournamentLabel() }
          </Grid.Column>
        </Grid>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={2}>
              {this.renderRanking()}
            </Grid.Column>
            <Grid.Column width={14}>{this.renderTournament()}</Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}