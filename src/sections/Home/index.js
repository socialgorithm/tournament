import React from 'react';
import { Container, Grid, Icon } from 'semantic-ui-react';

import Footer from '../../components/Footer';

import './index.css';

export default class Home extends React.Component {

  render() {

    return (
      <div>
        <div className='hero'>
            <Container>
                <h1>Welcome!</h1>
                <p>Something something</p>
            </Container>
        </div>
        <div className='section'>
            <Grid columns={ 3 }>
                    <Grid.Row>
                        <Grid.Column>
                            <h1>
                                <Icon name='book' /><br/ >
                                Documentation
                            </h1>
                        </Grid.Column>
                        <Grid.Column>
                            <h1>
                                <Icon name='game' /><br/ >
                                Create Match
                            </h1>
                        </Grid.Column>
                        <Grid.Column>
                            <h1>
                                <Icon name='lab' /><br/ >
                                Analyse Games
                            </h1>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
        </div>
        <div className='bg-primary section'>
            Powered by #socialgorithm
        </div>
        <Footer />
      </div>
    );
  }
}