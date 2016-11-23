import React from 'react';
import ReactDOM from 'react-dom';
import DraggableSVG from './DraggableSVG';

it('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(
    <DraggableSVG width={800} height={600} scale={10}>
      <rect x={40} y={30} width={6} height={2}
        style={{fillOpacity: '0.1'}}>
      </rect>
    </DraggableSVG>,
    div
  );
});
