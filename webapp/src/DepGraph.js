import React, { Component } from 'react';
import DepCard from './DepCard';
import Graph from './Graph';

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
    var key = this.host + '/' + this.title;
    return <DepCard
      key={key}
      cx={cx} cy={cy}
      host={this.host}
      title={this.title}
      href={this.href}
      blockers={this.blockers}
      dependencies={this.dependencyCount()}
      related={this.relatedCount()}
      dependents={this.dependentCount(key, nodes || {})}
      done={this.done} />
  }
}

class DepGraph extends Component {
  nodes() {
    return {
      'asana/jbenet/depviz#7': new Node({
        host: 'asana',
        title: 'jbenet/depviz#234',
        href: 'https://asana.com/jbenet/depviz/issues/8',
        done: false,
        dependencies: [
          'github/jbenet/depviz#10',
        ],
      }),
      'github/d3/d3#4356': new Node({
        host: 'github',
        title: 'd3/d3#4356',
        href: 'https://github.com/d3/d3/pull/4356',
        done: true,
      }),
      'github/gviz/gviz-d3#32': new Node({
        host: 'github',
        title: 'gviz/gviz-d3#32',
        href: 'https://github.com/d3/d3/pull/4356',
        done: true,
      }),
      'github/jbenet/depviz#1': new Node({
        host: 'github',
        title: 'jbenet/depviz#1',
        href: 'https://github.com/jbenet/depviz/issues/1',
        done: false,
        dependencies: [
          'github/jbenet/depviz#10',
        ],
      }),
      'github/jbenet/depviz#2': new Node({
        host: 'github',
        title: 'jbenet/depviz#2',
        href: 'https://github.com/jbenet/depviz/issues/2',
        done: true,
      }),
      'github/jbenet/depviz#3': new Node({
        host: 'github',
        title: 'jbenet/depviz#3',
        href: 'https://github.com/jbenet/depviz/issues/3',
        done: true,
        dependencies: [
          'github/d3/d3#4356',
          'github/gviz/gviz-d3#32',
          'github/jbenet/depviz#6',
          'github/jbenet/depviz#2',
          'gitlab/foo/bar#234',
        ],
      }),
      'github/jbenet/depviz#5': new Node({
        host: 'github',
        title: 'jbenet/depviz#5',
        href: 'https://github.com/jbenet/depviz/issues/5',
        done: false,
        related: [
          'github/jbenet/depviz#3',
        ],
      }),
      'github/jbenet/depviz#6': new Node({
        host: 'github',
        title: 'jbenet/depviz#6',
        href: 'https://github.com/jbenet/depviz/issues/6',
        done: true,
        dependencies: [
          'github/d3/d3#4356',
          'github/gviz/gviz-d3#32',
        ],
      }),
      'github/jbenet/depviz#7': new Node({
        host: 'github',
        title: 'jbenet/depviz#7',
        href: 'https://github.com/jbenet/depviz/issues/7',
        done: false,
        dependencies: [
          'github/jbenet/depviz#3',
        ],
      }),
      'github/jbenet/depviz#10': new Node({
        host: 'github',
        title: 'jbenet/depviz#10',
        href: 'https://github.com/jbenet/depviz/issues/10',
        done: false,
        dependencies: [
          'github/jbenet/depviz#3',
          'github/jbenet/depviz#5',
          'github/jbenet/depviz#7',
        ],
      }),
      'gitlab/foo/bar#234': new Node({
        host: 'gitlab',
        title: 'foo/bar#234',
        href: 'https://gitlab.com/foo/bar/issues/234',
        done: true,
        dependencies: [
          'github/jbenet/depviz#2',
        ],
      }),
    };
  }

  render() {
    var nodes = this.nodes();
    var renderNode = function(data) {
      return data.node.depCard(data.cx, data.cy, nodes);
    }
    return <Graph
      width={this.props.width}
      height={this.props.height}
      renderNode={renderNode}
      nodes={nodes} />
  }
}

export default DepGraph;
