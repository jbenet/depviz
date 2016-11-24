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
      this._calls = {};
    }

    getIssue(number) {
      if (this._calls[number]) {
        throw new Error(
          'duplicate call for github/' +
          this._user + '/' + this._repo + '#' + number
        );
      }
      this._calls[number] = true;
      if (number > 100) {
        return Promise.reject(new Error(
          'error making request GET https://api.github.com/repos/' +
          this._user + '/' + this._repo + '/issues/' + number
        ));
      }

      var dependencies = function (number) {
        switch (number) {
        case 1:
          return ['#10'];
        case 3:
          return ['#2', 'd3/d3#4356', 'gitlab/foo/bar#234'];
        case 5:
          return ['#3'];
        case 7:
          return ['#3'];
        case 10:
          return ['#3', '#7', '#5'];
        case 20:
          return ['foo/#3']; /* will be skipped */
        default:
          return [];
        }
      };

      return Promise.resolve({
        data: {
          body: dependencies(number).map(function (dep) {
            return 'depends on ' + dep;
          }).join('\n') + '\n',
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

import GetGitHubNode from './GitHub';

it('foobar host crashes', () => {
  expect(() =>
    GetGitHubNode('foobar/jbenet/depviz#1')
  ).toThrowError('unrecognized GitHub key: foobar/jbenet/depviz#1');
});

it('foo/#3 reference is skipped without crashing', () => {
  return new Promise(
    function (resolve, reject) {
      GetGitHubNode('github/jbenet/depviz#20').then(
        function (node) {
          if (node.parents().length) {
            reject(new Error(
              'mock github/jbenet/depviz#20 should have no parents'
            ));
            return;
          }
          resolve();
        },
        reject,
      );
    }
  );
});

it('long and short references are understood', () => {
  return new Promise(
    function (resolve, reject) {
      GetGitHubNode('github/jbenet/depviz#3').then(
        function (node) {
          if (node.parents().length !== 3) {
            reject(new Error(
              'mock github/jbenet/depviz#3 should have three parents'
            ));
            return;
          }
          if (node.parents()[0] !== 'github/jbenet/depviz#2') {
            reject(new Error(
              'short reference not expanded in github/jbenet/depviz#3'
            ));
            return;
          }
          resolve();
        },
        reject,
      );
    }
  );
});
