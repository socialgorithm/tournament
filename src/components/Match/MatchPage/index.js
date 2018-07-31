import React, { Fragment } from "react";
import {
  Icon,
  Container,
  Loader,
  Grid,
  Label,
  List,
  Segment,
  Table
} from "semantic-ui-react";

import UTTTGame from "../../UTTTGame";
import Match from "./Match";

export default class MatchPage extends React.PureComponent {
  constructor(props) {
    super(props);

    console.log("Render Match Page", props);
  }
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

  renderCurrentMatch() {
    if (this.props.tournament.finished) {
      return null;
    }
    const matches = this.props.tournament.matches;
    const currentMatch = matches.find(match => match.stats.state === "playing");
    return (
      <Fragment>
        <h2>Current Match</h2>
        {currentMatch && (
          <Segment>
            <Match
              playerA={currentMatch.players[0].token}
              playerB={currentMatch.players[1].token}
              winsA={currentMatch.stats.wins[0]}
              winsB={currentMatch.stats.wins[1]}
              gamesPlayed={currentMatch.stats.games}
              totalGames={this.props.tournament.options.numberOfGames}
              displayProgress
            />
          </Segment>
        )}
        {!currentMatch && (
          <Segment textAlign="center">
            <Loader active inline content="Waiting for Match to start..." />
          </Segment>
        )}
      </Fragment>
    );
  }

  renderCurrentGame() {
    if (this.props.tournament.finished) {
      return null;
    }
    const matches = this.props.tournament.matches;
    const currentMatch = matches.find(match => match.stats.state === "playing");

    if (!currentMatch) {
      return null;
    }

    const utttGameStyle = {
      fontSize: "0.6em"
    };

    return (
      <Fragment>
        <h2>Game</h2>
        <div style={utttGameStyle}>
          <UTTTGame hideSlider />
        </div>
      </Fragment>
    );
  }

  /**
   * Renders the current match and the finished ones
   */
  renderMatches() {
    const matches = this.props.tournament.matches;
    return (
      <Fragment>
        {this.renderCurrentMatch()}

        <h3>Finished</h3>
        {matches
          .filter(match => match.stats.state === "finished")
          .map(match => (
            <Segment>
              <Match
                playerA={match.players[0].token}
                playerB={match.players[1].token}
                winsA={match.stats.wins[0]}
                winsB={match.stats.wins[1]}
              />
            </Segment>
          ))}
      </Fragment>
    );
  }

  renderUpcoming() {
    const matches = this.props.tournament.matches;
    const upcoming = matches.filter(match => match.stats.state === "upcoming");
    if (upcoming.length < 1) {
      return null;
    }
    return (
      <Fragment>
        <h2>Next Matches</h2>
        <List relaxed>
          {upcoming.map(match => (
            <List.Item>
              <b>{match.players[0].token}</b> vs <b>{match.players[1].token}</b>
            </List.Item>
          ))}
        </List>
      </Fragment>
    );
  }

  renderRanking() {
    return (
      <Fragment>
        <h2>Ranking</h2>
        <Table compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell>Player</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.tournament.ranking.map((player, $index) => (
              <Table.Row>
                <Table.Cell>{$index + 1}</Table.Cell>
                <Table.Cell>{player}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Fragment>
    );
  }

  render() {
    return (
      <Container>
        <Grid columns={2}>
          <Grid.Column>
            <h1>
              <Icon name="game" /> Tournament
            </h1>
          </Grid.Column>
          <Grid.Column textAlign="right">
            {this.renderTournamentLabel()}
          </Grid.Column>
        </Grid>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={4}>{this.renderRanking()}</Grid.Column>
            <Grid.Column width={12}>{this.renderMatches()}</Grid.Column>
            {/* <Grid.Column width={ 4 }>
                            { this.renderCurrentGame() }
                            { this.renderUpcoming() }
                        </Grid.Column> */}
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
