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
import { hashHistory } from 'react-router'
import App, { DepGraphView } from './App';

it('home page renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('DepGraphView renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <DepGraphView params={{'splat': 'dummy/jbenet/depviz/1'}} />,
    div
  );
});

it('entering graph view normalizes non-canonical paths', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <App />,
    div,
    function () {
      hashHistory.push('/http/dummy/jbenet/depviz/issues/1');
      expect(
        hashHistory.getCurrentLocation().pathname
      ).toBe('/http/dummy/jbenet/depviz/1');
    },
  );
});
