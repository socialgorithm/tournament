import App from './sections/App';
import HomePage from './sections/HomePage';
import NotFoundPage from './sections/NotFoundPage';

export default function createRoutes() {
  return [
    {
      component: { App },
      childRoutes: [
        {
          path: '/',
          name: 'home',
          component: { HomePage },
        },
        {
          path: '*',
          name: 'notfound',
          component: { NotFoundPage },
        },
      ]
    },
  ];
}
