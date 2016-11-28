import React, { Component } from 'react';
import { Router, IndexRoute, Route, hashHistory } from 'react-router'
import './App.css';
import DepGraph from './DepGraph';
import GetDummyHostNodes, { CanonicalDummyHostKey } from './DummyHost';
import GetGitHubNodes, { CanonicalGitHubKey } from './GitHub';
import GetNodes, { Canonicalizers, Getters, CanonicalKey } from './GetNodes';
import Home from './Home';
import Layout, { HeaderHeight } from './Layout';

Canonicalizers['dummy'] = CanonicalDummyHostKey;
var dummyGetter = new GetDummyHostNodes();
Getters['dummy'] = dummyGetter.GetNodes.bind(dummyGetter);

Canonicalizers['github.com'] = CanonicalGitHubKey;
Getters['github.com'] = GetGitHubNodes;

export class DepGraphView extends Component {
  getSize() {
    return {
      height: window.innerHeight - HeaderHeight,
      width: window.innerWidth,
    }
  }

  render() {
    return <DepGraph
      getSize={this.getSize.bind(this)}
      getNodes={GetNodes} canonicalKey={CanonicalKey}
      slugs={[this.props.params.splat]} />
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
