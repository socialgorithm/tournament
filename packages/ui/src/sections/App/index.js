import React from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import queryString from 'qs';
import 'react-toastify/dist/ReactToastify.css';
import { Grid } from 'semantic-ui-react';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SocketContainer from '../../containers/SocketContainer';
import Tournaments from '../Tournaments';
import Replay from '../Replay';
import NotFound from '../NotFoundPage';

import './index.scss';
class App extends React.PureComponent {
  render() {
    const params = queryString.parse(this.props.location.search.substr(1));
    if (params.p) {
      return (
        <Redirect to={ params.p } />
      );
    }
    return (
      <SocketContainer>
        <ToastContainer />
        <Grid columns={ 1 } padded>
          <Header />
          <Grid.Row className='main-container'>
            <Switch>
              <Route exact path="/"><Redirect to="/tournament"/></Route>
              <Route path='/tournament' component={ Tournaments } />
              <Route path='/replay' component={ Replay } />
              <Route path='' component={ NotFound } />
            </Switch>
          </Grid.Row>
          <Grid.Row className='footer-container'>
            <Footer />
          </Grid.Row>
        </Grid>
      </SocketContainer>
    );
  }
}

export default withRouter(App);
