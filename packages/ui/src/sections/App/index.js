import React from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import queryString from 'qs';
import 'react-toastify/dist/ReactToastify.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SocketContainer from '../../containers/SocketContainer';
import Home from '../Home';
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
        <Header />
        <ToastContainer />
        <div className='main-content'>
          <Switch>
            <Route exact path='/' component={ Home } />
            <Route path='/tournaments' component={ Tournaments } />
            <Route path='/replay' component={ Replay } />
            <Route path='' component={ NotFound } />
          </Switch>
        </div>
        <Footer />
      </SocketContainer>
    );
  }
}

export default withRouter(App);
