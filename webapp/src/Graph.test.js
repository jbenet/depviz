import React from 'react';
import ReactDOM from 'react-dom';
import Graph from './Graph';

it('renders without crashing', () => {
  const div = document.createElement('div');

  var nodes = {
    'a': {
      title: 'a',
      parents: function() {return [];},
    },
    'b': {
      title: 'b',
      parents: function() {return ['a'];},
    },
    'c': {
      title: 'c',
      parents: function() {return ['a', 'b'];},
    },
  };

  var renderNode = function(data) {
    return <g key={data.node.title}>
      <rect x={data.cx - 3} y={data.cy - 1} width={6} height={2}
        style={{fillOpacity: '0.1'}}>
      </rect>
      <text x={data.cx} y={data.cy}>
        {data.node.title}
      </text>
    </g>
  }

  ReactDOM.render(
    <Graph width={800} height={600} nodes={nodes} renderNode={renderNode} />,
    div
  );
});
