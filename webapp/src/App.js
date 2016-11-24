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
          <h1>depviz</h1>
        </div>
        <DepGraph width={window.innerWidth} height={window.innerHeight - 40} slug="github/jbenet/depviz#7" />
      </div>
    );
  }
}

export default App;
