# Impeccable Commentary

- A full stack app written using VanillaJs & React for frontend, and NodeJs, ExpressJs, SocketIO, Knex & PostgreSQL for backend.
- It allows the users to submit, upvote and reply to comments - providing support for one level nesting / threading.
- The upvotes view is real-time over WebSockets: changes to upvotes from other pages (or APIs) will be updated accordingly w/o requiring manual intervention.
- The users are randomized using the jurors from the movie _Twelve Angry Men_, and a new one is selected after every comment / reply submission.

> Before running the services, please ensure PostgreSQL is installed and setup as mentioned in the [Knexfile](https://github.com/rkrux/impeccable-commentary/blob/master/backend/knexfile.js).

## Backend Setup

- npm install
- npx knex migrate:latest
- npx knex seed:run
- npm run dev

## Frontend Setup

- npm install
- npm run dev

***

A demo is [here](https://impeccable-commentary.herokuapp.com/).
