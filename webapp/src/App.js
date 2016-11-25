import React, { Component } from 'react';
import { Router, IndexRoute, Route, hashHistory } from 'react-router'
import './App.css';
import DepGraph from './DepGraph';
import GetDummyHostNode, { CanonicalDummyHostKey } from './DummyHost';
import GetGitHubNode, { CanonicalGitHubKey, GetGitHubRepoNodes } from './GitHub';
import GetNode, { Canonicalizers, Getters, CanonicalKey } from './GetNode';
import Home from './Home';
import Layout, { HeaderHeight } from './Layout';

export class DepGraphView extends Component {
  render() {
    var attributes = {};
    const key = this.props.params.splat;
    const host = key.split('/', 1)[0];
    if (host === 'github.com') {
      var match = /^github.com\/([^\/#]+)\/([^\/#]+)?$/.exec(key);
      if (match === null) {
        attributes.slugs = [key];
      } else {
        var user = match[1];
        var repo = match[2];
        attributes.getInitialNodes = function (pushNodes) {
          return GetGitHubRepoNodes(user, repo, pushNodes);
        };
      }
    } else {
      attributes.slugs = [key];
    }
    return <DepGraph
      width={window.innerWidth}
      height={window.innerHeight - HeaderHeight}
      getNode={GetNode} canonicalKey={CanonicalKey}
      {...attributes} />
  }
}

function enterGraphView(nextState, replace) {
  const splat = nextState.params.splat;
  var canonicalKey;
  try {
    canonicalKey = CanonicalKey(splat);
  } catch (error) {
    var match;
    match = /^github.com\/([^\/#]+)\/([^\/#]+)?$/.exec(splat);
    if (match === null) {
      throw error;
    }
    canonicalKey = splat;
  }
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
        <Router history={hashHistory}>
          <Route path="/" component={Layout}>
            <IndexRoute component={Home} />
            <Route path="/http/*" component={DepGraphView}
              onEnter={enterGraphView} />
          </Route>
        </Router>
      </div>
    );
  }
}

export default App;
