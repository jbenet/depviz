import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';

it('home page without size renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Home />, div);
});
