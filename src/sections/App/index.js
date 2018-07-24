import React from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import queryString from 'query-string';
import 'react-toastify/dist/ReactToastify.css';

import Header from '../../components/Header';
import SocketContainer from '../../containers/SocketContainer';
import Home from '../Home';
import Match from '../Match';
import Replay from '../Replay';
import NotFound from '../NotFoundPage';

import './index.css';
class App extends React.PureComponent {
  render() {
    const params = queryString.parse(this.props.location.search);
    if (params.p) {
      return (
        <Redirect to={ params.p } />
      );
    }
    return (
      <SocketContainer>
        <Header />
        <ToastContainer />
        <Switch>
          <Route exact path='/' component={ Home } />
          <Route path='/match' component={ Match } />
          <Route path='/replay' component={ Replay } />
          <Route path='' component={ NotFound } />
        </Switch>
      </SocketContainer>
    );
  }
}

export default withRouter(App);
