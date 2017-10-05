const path = require('path');
const express = require('express');
const apollo = require('apollo-fetch');

const uri = 'https://api.github.com/graphql';
const app = express();
const apolloFetch = apollo.createApolloFetch({ uri });

const query = require('./query/participantsOfIssues');

app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 9090);
app.listen(app.get('port'));

apolloFetch.use(({ options }, next) => {
  if (!options.headers) {
    options.headers = {}; // Create the headers object if needed.
  }
  options.headers.Authorization = 'bearer abf6ca45931d7c36ead3269f8297b9151dd94613';

  next();
});

const getParticipantsByIssues = (cursor = "") => {
  let issuesParams = 'first:100';

  if (cursor != '') {
    issuesParams += `, after:"${cursor}"`;
  }

  return apolloFetch({
    query: query(issuesParams),
  });
};

const USERS = [];

const startCounting = (cursor, callback) => {
  console.log('starting count', cursor);

  getParticipantsByIssues(cursor).then((resp) => {

    console.log('getParticipantsByIssues', cursor);

    const repository = resp.data.repository;
    const edgesLength = repository.issues.edges.length;

    if (edgesLength >= 100) {

      repository.issues.nodes.forEach((node) => {
        if (node.author) {
          const userPosition = USERS[node.author.login];

          if (userPosition === undefined) {
            USERS[node.author.login] = 0;
          }

          USERS[node.author.login] += 1;

          node.participants.edges.forEach((edge) => {
            const userCount = USERS[edge.node.login];

            if (userCount === undefined) {
              USERS[edge.node.login] = 0;
            }

            USERS[edge.node.login] += 1;
          });
        }
      });
    }

    if (edgesLength === 0) {
      return callback(USERS);
    }

    return startCounting(repository.issues.edges[edgesLength - 1].cursor, callback);
  }).catch(error => console.error(error));
};

app.get('/', (req, res) => {
  console.log('starting...');
  startCounting('Y3Vyc29yOnYyOpHOB8VGjg==', function (users) {
    var sortedUsers = [];

    Object.keys(users).forEach(function(key, i) {
      console.log(key, users[key]);
      sortedUsers.push([key, users[key]]);
    });

    sortedUsers.sort(function (a, b) {
      return a[1] - b[1];
    })

    console.log(sortedUsers);
    res.render('./users.ejs', { users: sortedUsers });
  })
});
