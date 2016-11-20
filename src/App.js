import React, { Component } from 'react';
import logo from './logo/react.svg';
import './App.css';
import DepCard from './DepCard';

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
            width="800" height="600" viewBox="0 0 80 60" fontSize="1">
          <DepCard
            cx={40} cy={30}
            host="github"
            title="jbenet/depviz#1"
            href="https://github.com/jbenet/depviz/issues/1"
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
