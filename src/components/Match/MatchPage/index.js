import React, { Fragment } from 'react';
import { Icon, Container, Loader, Grid, Label, List, Segment } from 'semantic-ui-react';

import UTTTGame from '../../UTTTGame';
import Match from './Match';

export default class MatchPage extends React.PureComponent {
    constructor(props) {
        super(props);

        console.log('Render Match Page', props);
    }
    renderTournamentLabel() {
        let state = 'Waiting...';
        let color = null;
        if (this.props.started) {
            state = 'In Progress';
            color = 'orange';
        } else if(this.props.finished) {
            state = 'Completed';
            color = 'green';
        }
        return (
            <Label color={ color } content={ state } />
        );
    }

    /**
     * Renders the current match and the finished ones
     */
    renderMatches() {
        const matches = this.props.tournament.stats.matches;
        const currentMatch = matches.find(match => match.state === 'playing');
        return (
            <Fragment>
                <h2>Current Match</h2>
                { currentMatch && (
                    <Match
                        playerA={ currentMatch.players[0].token }
                        playerB={ currentMatch.players[1].token }
                        winsA={ currentMatch.players[0].gamesWon }
                        winsB={ currentMatch.players[1].gamesWon }
                        gamesPlayed={ currentMatch.games.length }
                        totalGames={ this.props.options.maxGames }
                        displayProgress
                    />
                ) }
                { !currentMatch && (
                    <Segment textAlign='center'>
                        <Loader active inline content='Waiting for Match to start...' />
                    </Segment>
                ) }
                

                <h3>Finished</h3>

                { matches.filter(match => match.state === 'finished').map(match => (
                    <Match
                        playerA={ match.players[0].token }
                        playerB={ match.players[1].token }
                        winsA={ match.players[0].gamesWon }
                        winsB={ match.players[1].gamesWon }
                    />
                )) }
            </Fragment>
        );
    }

    renderUpcoming() {
        const matches = this.props.tournament.stats.matches;
        return (
            <Fragment>
                <h2>Next Matches</h2>
                <List relaxed>
                    { matches.filter(match => match.state === 'upcoming').map(match => (
                        <List.Item>
                            <b>{ match.players[0].token }</b> vs <b>{ match.players[1].token }</b>
                        </List.Item>
                    )) }
                </List>
            </Fragment>
        );
    }

    renderRanking() {
        return 'Bharat hasnt made a ranking...';
        // return (
        //     <Fragment>
        //         <h2>Ranking</h2>
        //         <Table compact>
        //             <Table.Header>
        //                 <Table.Row>
        //                     <Table.HeaderCell>#</Table.HeaderCell>
        //                     <Table.HeaderCell>Player</Table.HeaderCell>
        //                 </Table.Row>
        //             </Table.Header>
        //             <Table.Body>
        //                 { this.props.ranking.players.map((player, $index) => (
        //                     <Table.Row>
        //                         <Table.Cell>{ $index + 1 }</Table.Cell>
        //                         <Table.Cell>{ player }</Table.Cell>
        //                     </Table.Row>
        //                 )) }                        
        //             </Table.Body>
        //         </Table>
        //     </Fragment>
        // );
    }

    render() {
        const utttGameStyle = {
            fontSize: '0.6em',
        };
        return (
            <Container>
                <Grid columns={ 2 }>
                    <Grid.Column>
                    <h1>
                        <Icon name='game' /> Tournament
                    </h1>
                    </Grid.Column>
                    <Grid.Column textAlign='right'>
                        { this.renderTournamentLabel() }
                    </Grid.Column>
                </Grid>
                <Grid columns={ 3 }>
                    <Grid.Row>
                        <Grid.Column width={ 3 }>
                            { this.renderRanking() }
                        </Grid.Column>
                        <Grid.Column width={ 9 }>
                            { this.renderMatches() }
                        </Grid.Column>
                        <Grid.Column width={ 4 }>
                            <h2>Game</h2>
                            <div style={ utttGameStyle }>
                                <UTTTGame hideSlider />
                            </div>

                            { this.renderUpcoming() }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    };
}