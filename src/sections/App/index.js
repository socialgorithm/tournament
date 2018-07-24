import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
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
