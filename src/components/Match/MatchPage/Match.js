import React from 'react';
import { Grid, Segment, Progress } from 'semantic-ui-react';

export default (props) => {
    const colorA = props.winsA > props.winsB ? 'green' : null;
    const colorB = props.winsB > props.winsA ? 'green' : null;

    const progressStyle = {
        margin: '2em 0 0',
    };

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
                style={ progressStyle }
            />
        );
    }

    return (
        <Segment>
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
        </Segment>
    );
};