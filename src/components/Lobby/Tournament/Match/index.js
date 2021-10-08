import React from 'react';
import classNames from 'classnames';
import { Grid, Progress } from 'semantic-ui-react';

import './index.scss';

export default (props) => {
    const { match, totalGames } = props;
    const stats = match.stats;
    const colorA = stats.wins[0] > stats.wins[1] ? 'green' : null;
    const colorB = stats.wins[1] > stats.wins[0] ? 'green' : null;

    let progress = null;
    let gridStyle = null;

    if (props.displayProgress) {
        gridStyle = {
            borderBottom: '1px solid #efefef',
        };
        progress = (
            <Progress
                value={ match.stats.gamesCompleted }
                total={ totalGames }
                progress='ratio'
                indicating
            />
        );
    }
    
    return (
        <div className={ classNames('match', { 'small': props.small }) }>
            <Grid columns={ 2 } textAlign='center' verticalAlign='middle' style={ gridStyle }>
                <Grid.Column color={ colorA }>
                    <h2>{ match.players[0] }</h2>
                    <h3>{ stats.wins[0] }</h3>
                </Grid.Column>
                <Grid.Column color={ colorB }>
                    <h2>{ match.players[1] }</h2>
                    <h3>{ stats.wins[1] }</h3>
                </Grid.Column>
            </Grid>
            { progress }
        </div>
    );
};