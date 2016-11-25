import React, { Component } from 'react';
import { Router, Route, hashHistory } from 'react-router'
import logo from './logo/react.svg';
import './App.css';
import DepGraph from './DepGraph';
import GetDummyHostNode, { CanonicalDummyHostKey } from './DummyHost';
import GetGitHubNode, { CanonicalGitHubKey } from './GitHub';
import GetNode, { Canonicalizers, Getters, CanonicalKey } from './GetNode';
import Home from './Home';

export class DepGraphView extends Component {
  render() {
    return <DepGraph
      width={window.innerWidth} height={window.innerHeight - 40}
      slugs={[this.props.params.splat]}
      getNode={GetNode} canonicalKey={CanonicalKey} />
  }
}

function enterGraphView(nextState, replace) {
  const splat = nextState.params.splat;
  const canonicalKey = CanonicalKey(splat);
  const canonicalPath = canonicalKey.replace(/#/g, '/');
  if (splat === canonicalKey || splat === canonicalPath) {
    return;
  }
  replace('/http/' + canonicalPath);
}

class App extends Component {
  render() {
    Canonicalizers['dummy'] = CanonicalDummyHostKey;
    Canonicalizers['github.com'] = CanonicalGitHubKey;
    Getters['dummy'] = GetDummyHostNode;
    Getters['github.com'] = GetGitHubNode;
    return (
      <div className="App">
        <div className="App-header">
          <a href="https://github.com/jbenet/depviz">
            <img src={logo} className="App-logo" alt="logo" />
          </a>
          <h1>depviz</h1>
        </div>
        <Router history={hashHistory}>
          <Route path="/" component={Home} />
          <Route path="/http/*" component={DepGraphView}
            onEnter={enterGraphView} />
        </Router>
      </div>
    );
  }
}

export default App;
