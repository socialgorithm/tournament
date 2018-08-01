import React from 'react';
import classNames from 'classnames';
import { Grid, Progress } from 'semantic-ui-react';

import './match.css';

export default (props) => {
    const colorA = props.winsA > props.winsB ? 'green' : null;
    const colorB = props.winsB > props.winsA ? 'green' : null;

    let progress = null;
    let gridStyle = null;

    if (props.displayProgress) {
        gridStyle = {
            borderBottom: '1px solid #efefef',
        };
        progress = (
            <Progress
                value={ props.gamesPlayed }
                total={ props.totalGames }
                progress='ratio'
                indicating
            />
        );
    }

    return (
        <div className={ classNames('match', { 'small': props.small }) }>
            <Grid columns={ 2 } textAlign='center' verticalAlign='middle' style={ gridStyle }>
                <Grid.Column color={ colorA }>
                    <h2>{ props.playerA }</h2>
                    <h3>{ props.winsA }</h3>
                </Grid.Column>
                <Grid.Column color={ colorB }>
                    <h2>{ props.playerB }</h2>
                    <h3>{ props.winsB }</h3>
                </Grid.Column>
            </Grid>
            { progress }
        </div>
    );
};