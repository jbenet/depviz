import React, { Component } from 'react';
import logo from './logo/react.svg';
import './App.css';
import DepGraph from './DepGraph';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <DepGraph width={window.innerWidth} height={window.innerHeight} slug="github/jbenet/depviz#7" />
      </div>
    );
  }
}

export default App;
