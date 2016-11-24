import React, { PureComponent } from 'react';
import GitHub from 'github-api';
import { Red, Green } from './Color';
import DepCard from './DepCard';
import Graph from './Graph';

const gh = new GitHub(); /* unauthenticated client */

class Node {
  constructor(data) {
    for (var key in data) {
      if (true) {
        this[key] = data[key];
      }
    }
  }

  parents() {
    return this.dependencies ? this.dependencies : [];
  }

  dependencyCount() {
    return this.dependencies ? this.dependencies.length : 0;
  }

  relatedCount() {
    return this.related ? this.related.length : 0;
  }

  dependentCount(key, nodes) {
    var count = 0;
    for (var dependentKey in nodes) {
      if (true) {
        if (nodes[dependentKey].parents().indexOf(key) !== -1) {
          count += 1;
        }
      }
    }
    return count;
  }

  depCard(cx, cy, nodes) {
    return <DepCard
      key={this.key}
      cx={cx} cy={cy}
      slug={this.key}
      host={this.host}
      title={this.title}
      href={this.href}
      blockers={this.blockers}
      dependencies={this.dependencyCount()}
      related={this.relatedCount()}
      dependents={this.dependentCount(this.key, nodes || {})}
      done={this.done} />
  }
}

class DepGraph extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nodes: {},
    };
    this.nodePromise = this.nodes();
  }

  nodes() {
    return this.getNode(this.props.slug);
  }

  getNode(key) {
    if (this.state.nodes[key]) {
      return Promise.resolve();
    }
    var host = key.split('/', 1);
    if (host[0] === 'github') {
      return this.getGitHubNode(key);
    }
    throw new Error('unrecognized key host: ' + key);
  }

  getGitHubNode(key) {
    var match = /^github\/(.*)\/(.*)#([0-9]*)$/.exec(key);
    if (!match) {
      throw new Error('unrecognized GitHub key: ' + key);
    }
    var user = match[1];
    var repo = match[2];
    var number = parseInt(match[3], 10);
    var _this = this;
    return gh.getIssues(
      user, repo
    ).getIssue(
      number
    ).then(function (issue) {
      var dependencies = [];
      var related = [];
      var regexp = /^depends +on +(?:([^ ]+)\/)?(?:([^ ]+))?(?:#([0-9]+)) *$/gim;
      // FIXME: look for related too
      var match;
      for (;;) {
        match = regexp.exec(issue.data.body);
        if (match === null) {
          break;
        }
        var user1 = match[1];
        var repo1 = match[2];
        var number1 = parseInt(match[3], 10);
        if ((user1 && !repo1) || (!user1 && repo1)) {
          continue;
        }
        if (!user1 && !repo1) {
          user1 = user;
          repo1 = repo;
        }
        var relatedKey = 'github/' + user1 + '/' + repo1 + '#' + number1;
        dependencies.push(relatedKey);
        if (issue.data.state === 'open') {
          _this.getNode(relatedKey);  // FIXME: attach promise result
        }
      }
      var nodes = {..._this.state.nodes};
      nodes[key] = new Node({
        key: key,
        host: 'github',
        title: issue.data.title,
        href: issue.data.html_url,
        done: issue.data.state !== 'open',
        dependencies: dependencies,
        related: related,
        user: issue.data.user.login,
      });
      _this.setState({..._this.state, nodes: nodes});
    });
  }

  render() {
    var _this = this;
    var renderNode = function(data) {
      return data.node.depCard(data.cx, data.cy, _this.state.nodes);
    }
    var renderEdge = function(data) {
      var key = (data.node1.host + '/' + data.node1.title + '-' +
        data.node2.host + '/' + data.node2.title);
      var style = {
        stroke: data.node1.done ? Green : Red,
        strokeWidth: 0.2,
      };
      return <path key={key} d={data.path} style={style} />
    }
    return <Graph
      width={this.props.width}
      height={this.props.height}
      scale={10}
      renderNode={renderNode}
      renderEdge={renderEdge}
      nodes={this.state.nodes} />
  }
}

export default DepGraph;
