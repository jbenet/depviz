import React, { Component } from 'react';
import Viz from 'viz.js';
import xml2js from 'xml2js';

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dx: 0,
      dy: 0,
      start: null,
    };
    this.startDrag = this.startDrag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  graphvizName(key) {
    return key.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  graphviz(nodes) {
    var gv = [
      'digraph {',
      '  node [shape=box];', /* FIXME: node size */
    ];
    var key, node, name;
    for (key in nodes) {
      if (true) {
        node = nodes[key];
        name = this.graphvizName(key);
        gv.push('  node [href=' + name + '] ' + name + ';');
      }
    }
    for (key in nodes) {
      if (true) {
        node = nodes[key];
        name = this.graphvizName(key);
        var parents = node.parents();
        for (var index in parents) {
          if (true) {
            var dep = this.graphvizName(parents[index]);
            gv.push('  ' + name + ' -> ' + dep + ';');
          }
        }
      }
    }
    gv.push('}');
    return gv.join('\n');
  }

  positionNodes(nodes) {
    var gv = this.graphviz(nodes);
    var svg = Viz(gv, {format: 'svg', engine: 'dot', scale: 2});
    var json, name, key, node;
    xml2js.parseString(svg, function (err, result) {
      /* FIXME: handle errors */
      json = result;
    });
    var gvWidth = parseFloat(json.svg['$'].width);
    var gvHeight = parseFloat(json.svg['$'].height);
    var scale = 0.15;
    var positioned = [];
    for (key in nodes) {
      if (true) {
        node = nodes[key];
        name = this.graphvizName(key);
        for (var index in json.svg.g[0].g) {
          if (true) {
            var g = json.svg.g[0].g[index];
            if (g.title[0] === name) {
              var text = g.g[0].a[0].text[0]['$'];
              var x = parseFloat(text.x) - gvWidth / 2;
              var y = -parseFloat(text.y) - gvHeight / 2;
              x *= scale;
              y *= scale;
              x += this.userWidth() / 2;
              y += this.userHeight() / 2;
              positioned.push({
                key: name,
                node: node,
                cx: x,
                cy: y,
              });
              break;
            }
          }
        }
      }
    }
    /* FIXME: record edges */
    return positioned;
  }

  userWidth() {
    return this.props.width / 10;
  }

  userHeight() {
    return this.props.height / 10;
  }

  viewBox() {
    return [
      this.state.dx,
      this.state.dy,
      this.userWidth(),
      this.userHeight(),
    ].join(' ');
  }

  startDrag(event) {
    this.setState({start: [event.clientX, event.clientY]});
  }

  stopDrag(event) {
    this.setState({start: null});
  }

  handleMouseMove(event) {
    if (this.state.start) {
      this.setState({
        dx: this.state.dx + (this.state.start[0] - event.clientX) / 10,
        dy: this.state.dy + (this.state.start[1] - event.clientY) / 10,
        start: [event.clientX, event.clientY],
      });
    }
  }

  /* Properties:
   *
   * * width, the width of the graph viewport in pixels.
   * * height the height of the graph viewport in pixels.
   * * nodes, an object with name keys and node values.  Nodes must
   *   support:
   *   * parents(), a method which returns an array of parent-node
   *     names.
   * * renderNode({node: ..., cx: ..., cy: ...), a method which
   *   renders a node in the graph.
   */
  render() {
    return <svg id="svg" xmlns="http://www.w3.org/2000/svg"
          width={this.props.width} height={this.props.height}
          viewBox={this.viewBox()} fontSize="1"
          style={{border: 'solid 2px #333'}}
          onMouseDown={this.startDrag}
          onMouseUp={this.stopDrag}
          onMouseOut={this.stopDrag}
          onMouseMove={this.handleMouseMove}>
        {this.positionNodes(this.props.nodes).map(this.props.renderNode)}
      </svg>
  }
}

export default Graph;
