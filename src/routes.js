import App from './sections/App';

export default function createRoutes() {
  return [
    {
      path: '/',
      component: App,
      indexRoute: { onEnter: (nextState, replace) => replace('/about') },
      childRoutes: [
        {
          path: '/about',
          name: 'about',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./sections/About').default)
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
