import React, { Fragment } from "react";
import {
  Loader,
  Grid,
  List,
  Segment,
} from "semantic-ui-react";

import Match from '../Match';
import UTTTGame from '../../../UTTTGame';

export default class MatchPage extends React.PureComponent {

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
              match={ currentMatch }
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

    if (!this.props.currentGame) {
      return null;
    }

    const utttGameStyle = {
      fontSize: "0.6em"
    };

    return (
      <Fragment>
        <h2>Game</h2>
        <div style={utttGameStyle}>
          <UTTTGame
            hideSlider
            game={ this.props.currentGame }
          />
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
                match={ match }
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

  render() {
    return (
      <Grid columns={1}>
        <Grid.Row>
          <Grid.Column width={15}>{this.renderMatches()}</Grid.Column>
          {/* <Grid.Column width={ 4 }>
                          { this.renderCurrentGame() }
                          { this.renderUpcoming() }
                      </Grid.Column> */}
        </Grid.Row>
      </Grid>
    );
  }
}
