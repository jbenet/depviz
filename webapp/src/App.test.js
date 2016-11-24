jest.mock('github-api', () => {
  class GitHub {
    getIssues(user, repo) {
      return new Issues(user, repo);
    }
  }

  class Issues {
    constructor(user, repo) {
      this._user = user;
      this._repo = repo;
    }

    getIssue(number) {
      return Promise.resolve({
        data: {
          body: '',
          html_url: 'https://github.com/' +
            this._user + '/' + this._repo + '/issues/' + number,
          state: number < 10 ? 'open' : 'closed',
          title: 'Some title for ' + number,
          user: {
            login: 'author' + number,
          },
        }
      });
    }
  }

  return jest.fn(() => new GitHub());
});

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
