import React from 'react';
import ReactDOM from 'react-dom';
import { Red, Green } from './Color';
import DepIndicators, { DepIndicator } from './DepIndicators';

it('thick renders without crashing', () => {
  const svg = document.createElement('svg');
  ReactDOM.render(
    <DepIndicators
      cx={0} cy={0} dy={2}
      blockers={2}
      dependencies={5}
      related={1}
      dependents={2}
      done={false} />,
    svg
  );
});

it('thin renders without crashing', () => {
  const svg = document.createElement('svg');
  ReactDOM.render(
    <DepIndicators
      cx={0} cy={0} dy={1.5}
      blockers={2}
      dependencies={5}
      related={1}
      dependents={2}
      done={false} />,
    svg
  );
});

it('no blockers renders without crashing', () => {
  const svg = document.createElement('svg');
  ReactDOM.render(
    <DepIndicators
      cx={0} cy={0} dy={2}
      dependencies={5}
      related={1}
      dependents={2}
      done={false} />,
    svg
  );
});

it('no dependents renders without crashing', () => {
  const svg = document.createElement('svg');
  ReactDOM.render(
    <DepIndicators
      cx={0} cy={0} dy={2}
      blockers={2}
      dependencies={5}
      related={1}
      done={false} />,
    svg
  );
});

it('full pie renders without crashing', () => {
  const svg = document.createElement('svg');
  ReactDOM.render(
    <DepIndicator
      cx={0} cy={0}
      title="testing pie.fraction == 1"
      count={3}
      color={Red}
      pie={{color: Green, fraction: 1}} />,
    svg
  );
});
