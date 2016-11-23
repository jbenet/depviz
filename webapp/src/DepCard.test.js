import React from 'react';
import ReactDOM from 'react-dom';
import DepCard from './DepCard';

it('renders without crashing', () => {
  const svg = document.createElement('svg');
  ReactDOM.render(
    <DepCard
      cx={40} cy={30}
      host="github"
      slug="github/jbenet/depviz#1"
      title="depviz v0: single page rendering"
      href="https://github.com/jbenet/depviz/issues/1"
      dependencies={5}
      related={1}
      dependents={20}
      done={false} />,
    svg
  );
});

it('asana renders without crashing', () => {
  const svg = document.createElement('svg');
  ReactDOM.render(
    <DepCard
      cx={40} cy={30}
      host="asana"
      slug="asana/jbenet/depviz#1"
      title="depviz v0: single page rendering"
      href="https://asana.com/jbenet/depviz/issues/1"
      dependencies={5}
      related={1}
      dependents={20}
      done={false} />,
    svg
  );
});

it('gitlab renders without crashing', () => {
  const svg = document.createElement('svg');
  ReactDOM.render(
    <DepCard
      cx={40} cy={30}
      host="gitlab"
      slug="gitlab/jbenet/depviz#1"
      title="depviz v0: single page rendering"
      href="https://gitlab.com/jbenet/depviz/issues/1"
      dependencies={5}
      related={1}
      dependents={20}
      done={false} />,
    svg
  );
});

it('foobar host crashes', () => {
  const svg = document.createElement('svg');
  expect(() => ReactDOM.render(
    <DepCard
      cx={40} cy={30}
      host="foobar"
      slug="foobar/jbenet/depviz#1"
      title="depviz v0: single page rendering"
      href="https://gitlab.com/jbenet/depviz/issues/1"
      dependencies={5}
      related={1}
      dependents={20}
      done={false} />,
    svg
  )).toThrowError('unrecognized host: foobar');
});
