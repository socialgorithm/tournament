# Socialgorithm Game/Tournament Web Client

This is the web client that participants use to play, administer or spectate Socialgorithm games.

A version of this client is always running at [tournaments.socialgorithm.org](https://tournaments.socialgorithm.org), hosted on Netlify.

It connects to a running [Tournament Server](https://server.socialgorithm.org)([Source])(https://github.com/socialgorithm/tournament/) and allows you to navigate the [Socialgorithm API](https://socialgorithm.org/docs/sections/architecture/api.html).

If you want to deploy your own version clone this repository and run `npm start`.

### Running Locally

To run locally, simply:

```
npm install
npm run start
```

## Dev stuff

This client is built with React, and some other modern libraries. It was bootstrapped from [create-react-app](https://github.com/facebookincubator/create-react-app) so you may already be familiar with the structure.

We use [Semantic UI](http://semantic-ui.com/) for the UI/UX.
