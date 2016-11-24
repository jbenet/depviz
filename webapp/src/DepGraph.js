import React, { PureComponent } from 'react';
import { Red, Green } from './Color';
import Graph from './Graph';

class DepGraph extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nodes: {},
      pending: {},
    };
  }

  componentDidMount() {
    this.nodes();
  }

  nodes() {
    if (!this.props.getNode) {
      throw new Error('getNode unset');
    }
    var promises = [];
    for (var index in this.props.slugs) {
      if (true) {
        var key = this.props.slugs[index];
        promises.push(this.getNode(key));
      }
    }
    return Promise.all(promises);
  }

  getNode(key) {
    var _this = this;
    this.setState(function (prevState) {
      if (prevState.nodes[key] || prevState.pending[key]) {
        return prevState;
      }
      _this.props.getNode(key).then(function (node) {
        _this.setState(function (prevState) {
          var nodes = {...prevState.nodes};
          nodes[key] = node;
          var pending = {...prevState.pending};
          delete pending[key];
          return {...prevState, nodes: nodes, pending: pending};
        });
        if (!node.props.done) {
          var parents = node.parents();
          for (var index in parents) {
            if (true) {
              var relatedKey = parents[index];
              _this.getNode(relatedKey);
            }
          }
        }
      });
      var pending = {...prevState.pending};
      pending[key] = true;
      return {...prevState, pending: pending};
    });
  }

  /* Properties:
   *
   * * slugs, roots for the issue graph.  An array of strings, like:
   *   ['github/jbenet/depviz#1', 'gitlab/foo/bar#123']
   * * width, the width of the graph viewport in pixels.
   * * height, the height of the graph viewport in pixels.
   * * getNode() -> Node, a callback for resolving nodes.
   */
  render() {
    var _this = this;
    var renderNode = function(data) {
      return data.node.depCard(data.cx, data.cy, _this.state.nodes);
    }
    var renderEdge = function(data) {
      var key = data.node1.props.slug + '-' + data.node2.props.slug;
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
