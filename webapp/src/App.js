import React, { Component } from 'react';
import logo from './logo/react.svg';
import './App.css';
import DepGraph from './DepGraph';
import GetDummyHostNode from './DummyHost';
import GetNode, { Getters } from './GetNode';
import GetGitHubNode from './GitHub';

class App extends Component {
  render() {
    Getters['dummy'] = GetDummyHostNode;
    Getters['github'] = GetGitHubNode;
    return (
      <div className="App">
        <div className="App-header">
          <a href="https://github.com/jbenet/depviz">
            <img src={logo} className="App-logo" alt="logo" />
          </a>
          <h1>depviz</h1>
        </div>
        <DepGraph width={window.innerWidth} height={window.innerHeight - 40}
          slugs={['github/jbenet/depviz#1']}
          getNode={GetNode} />
      </div>
    );
  }
}

export default App;
