import App from './sections/App';

export default function createRoutes() {
  return [
    {
      path: '/',
      component: App,
      indexRoute: { onEnter: (nextState, replace) => replace('/home') },
      childRoutes: [
        {
          path: '/home',
          name: 'home',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./sections/Home').default)
            })
          },
        },
        {
          path: '/stats',
          name: 'stats',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./containers/StatsContainer').default)
            })
          },
        },
        {
          path: '/replay',
          name: 'replay',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./sections/Replay').default)
            })
          },
        },
        {
          path: '/match',
          name: 'match',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./sections/Match').default)
            })
          },
        },
        {
          path: '/tournaments',
          name: 'tournaments',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./containers/TournamentContainer').default)
            })
          },
        },
        {
          path: '*',
          name: 'notfound',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./sections/NotFoundPage').default)
            })
          },
        },
      ],
    }
  ];
}
