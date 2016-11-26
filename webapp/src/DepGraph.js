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
    if (!this.props.getNodes) {
      throw new Error('getNodes unset');
    }
    if (!this.props.canonicalKey) {
      throw new Error('canonicalKey unset');
    }
    for (var index in this.props.slugs) {
      if (true) {
        var key = this.props.slugs[index];
        this.getNodes(key);
      }
    }
  }

  pushNodes(nodes) {
    var index, node;
    var _this = this;
    this.setState(function (prevState) {
      var stateNodes = {...prevState.nodes};
      var pending = {...prevState.pending};
      for (index in nodes) {
        if (true) {
          var node = nodes[index];
          stateNodes[node.props.slug] = node;
          delete pending[node.props.slug];
        }
      }
      return {...prevState, nodes: stateNodes, pending: pending};
    });
    for (index in nodes) {
      if (true) {
        node = nodes[index];
        if (!node.props.done) {
          var parents = node.parents();
          for (var i in parents) {
            if (true) {
              var relatedKey = parents[i];
              this.getNodes(relatedKey);
            }
          }
        }
      }
    }
  }

  getNodes(key) {
    var _this = this;
    key = this.props.canonicalKey(key);
    this.setState(function (prevState) {
      if (prevState.nodes[key] || prevState.pending[key]) {
        return prevState;
      }
      _this.props.getNodes(key, _this.pushNodes.bind(_this));
      var pending = {...prevState.pending};
      pending[key] = true;
      return {...prevState, pending: pending};
    });
  }

  /* Properties:
   *
   * * slugs, roots for the issue graph.  An array of strings, like:
   *   ['github.com/jbenet/depviz#1', 'gitlab.com/foo/bar#123']
   * * width, the width of the graph viewport in pixels.
   * * height, the height of the graph viewport in pixels.
   * * canonicalKey(key) -> key, a callback for canonicalizing node
   *   names.
   * * getNodes(key, pushNodes) -> [Node, ...], a callback for
   *   resolving nodes.
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
