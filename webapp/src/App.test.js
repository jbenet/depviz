import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import App, { DepGraphView } from './App';

it('home page renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('issue view renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <DepGraphView params={{'splat': 'dummy/jbenet/depviz/30'}} />,
    div
  );
});

it('entering graph view normalizes non-canonical paths', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <App />,
    div,
    function () {
      hashHistory.push('/http/dummy/jbenet/depviz/issues/31');
      expect(
        hashHistory.getCurrentLocation().pathname
      ).toBe('/http/dummy/jbenet/depviz/31');
    },
  );
});

it('repo view renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <DepGraphView params={{'splat': 'github.com/jbenet/depviz'}} />,
    div
  );
});

it('user view renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <DepGraphView params={{'splat': 'github.com/jbenet'}} />,
    div
  );
});

it('expand/collapse key presses render without crashing', () => {
  const div = document.createElement('div');
  var location = {
    pathname: '/http/github.com/jbenet/depviz',
    query: {},
  };
  var replace = function (loc) {
    location.pathname = loc.pathname;
    location.query = loc.query;
  }
  ReactDOM.render(
    <DepGraphView router={{replace: replace}} location={location}
      params={{'splat': 'github.com/jbenet/depviz'}} />,
    div,
    function () {
      this.handleKeyPress({key: 'e'});
      expect(location.query.expanded).toBe('true');
      this.handleKeyPress({key: 'c'});
      expect(location.query).toBe(null);
    },
  );
});
