import React, { Component } from 'react';
import Router from 'react-router/lib/Router';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
import hashHistory from 'react-router/lib/hashHistory';
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

  expanded() {
    return (
      this.props.location &&
      this.props.location.query.expanded === 'true'
    );
  }

  getNodes(key, pushNodes) {
    return GetNodes(key, pushNodes, {expanded: this.expanded()});
  }

  handleKeyPress(event) {
    if (event.key === 'e' && !this.expanded()) {
      this.props.router.replace({
        pathname: this.props.location.pathname,
        query: {expanded: 'true'},
      });
    } else if (event.key === 'c' && this.expanded()) {
      this.props.router.replace({
        pathname: this.props.location.pathname,
        query: null,
      });
    }
  }

  render() {
    return <DepGraph
      getSize={this.getSize.bind(this)}
      getNodes={this.getNodes.bind(this)} canonicalKey={CanonicalKey}
      slugs={[this.props.params.splat]}
      onKeyPress={this.handleKeyPress.bind(this)} />
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
