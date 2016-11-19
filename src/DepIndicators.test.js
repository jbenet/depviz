import React from 'react';
import ReactDOM from 'react-dom';
import DepIndicators from './DepIndicators';

it('renders without crashing', () => {
  const svg = document.createElement('svg');
  ReactDOM.render(
    <DepIndicators
      x={0} y1={0} y2={80}
      blockers={2}
      dependencies={5}
      related={1}
      dependents={2}
      done={false} />,
    svg
  );
});
