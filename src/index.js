import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { useScroll } from 'react-router-scroll';
import 'semantic-ui-css/semantic.css';

import createRoutes from './routes';
import { selectLocationState } from './sections/App/selectors';

import './index.css';
import configureStore from './store';

const store = configureStore({}, browserHistory);

const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: selectLocationState(),
});

ReactDOM.render(
  <Provider store={ store }>
    <Router
      history={ history }
      routes={ createRoutes() }
      render={
        // Scroll to top when going to a new page, imitating default browser
        // behaviour
        applyRouterMiddleware(useScroll())
      }
    />
  </Provider>,
  document.getElementById('root')
);
