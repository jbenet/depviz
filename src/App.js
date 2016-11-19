import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DepIndicators from './DepIndicators';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <svg id="svg" xmlns="http://www.w3.org/2000/svg"
            width="1" height="1" overflow="visible">  /* auto viewBox? */
          <DepIndicators
            x={0} y1={0} y2={80}
            dependencies={5}
            related={1}
            dependents={20}
            done={false} />
        </svg>
      </div>
    );
  }
}

export default App;
