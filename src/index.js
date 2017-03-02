import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { useScroll } from 'react-router-scroll';
import 'semantic-ui-css/semantic.css';

import App from './sections/App';
import createRoutes from './routes';
import { selectLocationState } from './sections/App/selectors';

import './index.css';
import configureStore from './store';

// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
const initialState = {};
const store = configureStore(initialState, browserHistory);

// Sync history and store, as the react-router-redux reducer
// is under the non-default key ("routing"), selectLocationState
// must be provided for resolving how to retrieve the "route" in the state
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: selectLocationState(),
});

// Set up the router, wrapping all Routes in the App component
const rootRoute = {
  component: App,
  childRoutes: createRoutes(),
};

ReactDOM.render(
  <Provider store={ store }>
    <Router
      history={ history }
      routes={ rootRoute }
      render={
        // Scroll to top when going to a new page, imitating default browser
        // behaviour
        applyRouterMiddleware(useScroll())
      }
    />
  </Provider>,
  document.getElementById('root')
);
