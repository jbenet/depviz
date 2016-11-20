import React from 'react';
import ReactDOM from 'react-dom';
import DepCard from './DepCard';

it('renders without crashing', () => {
  const svg = document.createElement('svg');
  ReactDOM.render(
    <DepCard
      cx={40} cy={30}
      host="github"
      title="jbenet/depviz#1"
      href="https://github.com/jbenet/depviz/issues/1"
      dependencies={5}
      related={1}
      dependents={20}
      done={false} />,
    svg
  );
});
