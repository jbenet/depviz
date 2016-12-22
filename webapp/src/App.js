import React, { Component } from 'react';
import Router from 'react-router/lib/Router';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
import hashHistory from 'react-router/lib/hashHistory';
import './App.css';
import Config from './Config';
import DepGraph from './DepGraph';
import GetDummyHostNodes, { CanonicalDummyHostKey } from './DummyHost';
import GetGitHubNodes, { CanonicalGitHubKey, SetGitHubAuth } from './GitHub';
import GetNodes, { Canonicalizers, Getters, CanonicalKey } from './GetNodes';
import Home from './Home';
import Layout, { HeaderHeight } from './Layout';
import ShallowEqual from './ShallowEqual';

Canonicalizers['dummy'] = CanonicalDummyHostKey;
var dummyGetter = new GetDummyHostNodes();
Getters['dummy'] = dummyGetter.GetNodes.bind(dummyGetter);

Canonicalizers['github.com'] = CanonicalGitHubKey;
Getters['github.com'] = GetGitHubNodes;

function getSize() {
  return {
    height: window.innerHeight - HeaderHeight,
    width: window.innerWidth,
  }
}

export class HomeView extends Component {
  render() {
    return <Home getSize={getSize} location={this.props.location} />
  }
}

export class DepGraphView extends Component {
  expanded() {
    return (
      this.props.location &&
      this.props.location.query.expanded === 'true'
    );
  }

  getNodes(key, pushNodes) {
    return GetNodes(key, pushNodes, {
      expanded: this.expanded(),
      getNodes: this.getNodes.bind(this),
    });
  }

  handleKeyPress(event) {
    var query = Object.assign({}, this.props.location.query);
    if (event.key === 'e' && !this.expanded()) {
      query.expanded = 'true';
      this.props.router.replace({
        pathname: this.props.location.pathname,
        query: query,
      });
    } else if (event.key === 'c' && this.expanded()) {
      delete query.expanded;
      this.props.router.replace({
        pathname: this.props.location.pathname,
        query: query,
      });
    }
  }

  render() {
    return <DepGraph
      getSize={getSize}
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
  replace({
    pathname: '/http/' + canonicalPath,
    query: nextState.location.query,
  });
}

class App extends Component {
  changeView(prevState, nextState, replace) {
    var nextQuery = Object.assign({}, nextState.location.query);
    if (prevState.location.pathname === '/config' &&
        nextState.location.pathname !== '/config' &&
        nextState.location.query.back) {
      delete nextQuery.back;
      replace({
        pathname: nextState.location.pathname,
        query: nextQuery,
      });
    }

    if (prevState.location.query['github-token'] !==
        nextState.location.query['github-token']) {
      SetGitHubAuth({
        token: nextState.location.query['github-token'],
      });
    }

    var prevQuery = Object.assign({}, prevState.location.query);
    delete prevQuery.back;
    delete nextQuery.back;
    if (this.props.storage && !ShallowEqual(prevQuery, nextQuery)) {
      this.props.storage.setItem('depviz.config', JSON.stringify(nextQuery));
    }
  }

  render() {
    return (
      <div className="App">
        <Router history={hashHistory}>
          <Route
              path="/" component={Layout}
              onChange={this.changeView.bind(this)}
              storage={this.props.storage}>
            <IndexRoute component={HomeView} />
            <Route path="/config" component={Config} />
            <Route path="/http/*" component={DepGraphView}
              onEnter={enterGraphView} />
          </Route>
        </Router>
      </div>
    );
  }
}

export default App;
