import React from 'react';
import ReactDOM from 'react-dom';
import DepGraph from './DepGraph';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <DepGraph width={800} height={600} />,
    div
  );
});
