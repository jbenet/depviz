import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <App storage={window.localStorage} />,
  document.getElementById('root')
);
