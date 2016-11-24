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
      this._calls = [];
    }

    getIssue(number) {
      if (this._calls.indexOf(number) !== -1) {
        throw new Error(
          'duplicate call for github/' +
          this._user + '/' + this._repo + '#' + number
        );
      }
      this._calls.push(number);
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

import React from 'react';
import ReactDOM from 'react-dom';
import GitHub from 'github-api';
import DepGraph from './DepGraph';

it('renders without crashing', () => {
  const div = document.createElement('div');
  return new Promise(
    function (resolve, reject) {
      ReactDOM.render(
        <DepGraph width={800} height={600} slug="github/jbenet/depviz#7" />,
        div,
        function () {
          this.nodePromise.then(
            function (value) {
              resolve();
            },
            function (reason) {
              reject(reason);
            },
          );
        }
      );
    }
  );
});

it('foobar host crashes', () => {
  const div = document.createElement('div');
  expect(() => ReactDOM.render(
    <DepGraph width={800} height={600} slug="foobar/jbenet/depviz#7" />,
    div
  )).toThrowError('unrecognized key host: foobar/jbenet/depviz#7');
});

it('missing GitHub issue crashes', () => {
  const div = document.createElement('div');
  return new Promise(
    function (resolve, reject) {
      ReactDOM.render(
        <DepGraph width={800} height={600} slug="github/jbenet/depviz#999999999" />,
        div,
        function () {
          this.nodePromise.then(
            function (value) {
              reject(new Error('expected failure, got: ' + value));
            },
            function (reason) {
              if (reason instanceof Error &&
                  reason.toString() === 'Error: error making request GET https://api.github.com/repos/jbenet/depviz/issues/999999999') {
                resolve();
              }
              reject(new Error('expected a failed GET, got: ' + reason));
            },
          );
        }
      );
    }
  );
});

it('invalid GitHub key crashes', () => {
  const div = document.createElement('div');
  expect(() => ReactDOM.render(
    <DepGraph width={800} height={600} slug="github/jbenet/depviz#-1" />,
    div
  )).toThrowError('unrecognized GitHub key: github/jbenet/depviz#-1');
});

it('does not duplicate requests for loaded nodes', () => {
  const div = document.createElement('div');
  return new Promise(
    function (resolve, reject) {
      ReactDOM.render(
        <DepGraph width={800} height={600} slug="github/jbenet/depviz#7" />,
        div,
        function () {
          var _this = this;
          this.nodePromise.then(function (value) {
            return _this.getNode('github/jbenet/depviz#7');
          }).then(function (value) {
            resolve();
          }).catch(function (reason) {
            reject(reason);
          });
        }
      );
    }
  );
});

it('foo/#3 reference is skipped without crashing', () => {
  const div = document.createElement('div');
  return new Promise(
    function (resolve, reject) {
      ReactDOM.render(
        <DepGraph width={800} height={600} slug="github/jbenet/depviz#20" />,
        div,
        function () {
          this.nodePromise.then(
            function (value) {
              resolve();
            },
            function (reason) {
              reject(reason);
            },
          );
        }
      );
    }
  );
});
