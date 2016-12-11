import React from 'react';
import ReactDOM from 'react-dom';
import { Bad, Good } from './Color';
import DepIndicators, { DependenciesIndicator, DepIndicator } from './DepIndicators';

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
      color={Bad}
      pie={{color: Good, fraction: 1}} />,
    svg
  );
});

it('dependencies walked without crashing', () => {
  const svg = document.createElement('svg');
  var nodes = [];
  var getNodes = function(key, pushNodes) {
    pushNodes([key]);
  };
  var pushNodes = function(nds) {
    nodes = nodes.concat(nds);
  };
  ReactDOM.render(
    <DependenciesIndicator
      cx={0} cy={0}
      title="testing pie.fraction == 1"
      parents={['parent1', 'parent2']}
      blockers={0}
      dependencies={2}
      getNodes={getNodes}
      pushNodes={pushNodes} />,
    svg ,
    function () {
      this.getDependencies();
      expect(nodes).toEqual(['parent1', 'parent2']);
    }
  );
});
