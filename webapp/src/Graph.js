import React, { Component } from 'react';
import Viz from 'viz.js';
import xml2js from 'xml2js';

class Graph extends Component {
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

  positionNodes(nodes, width, height) {
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
              x += width / 2;
              y += height / 2;
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

  /* Properties:
   *
   * * width, the width of the graph viewport in pixels.
   * * height the height of the graph viewport in pixels.
   * * dx (optional), a number of user units to shift the viewBox
   *   horizontally.
   * * dy (optional), a number of user units to shift the viewBox
   *   vertically.
   * * nodes, an object with name keys and node values.  Nodes must
   *   support:
   *   * parents(), a method which returns an array of parent-node
   *     names.
   * * renderNode({node: ..., cx: ..., cy: ...), a method which
   *   renders a node in the graph.
   */
  render() {
    var userWidth = this.props.width / 10;
    var userHeight = this.props.height / 10;
    var positioned = this.positionNodes(this.props.nodes, userWidth, userHeight);
    const viewBox = [
      this.props.dx || 0,
      this.props.dy || 0,
      userWidth,
      userHeight,
    ].join(' ');
    return <svg id="svg" xmlns="http://www.w3.org/2000/svg"
          width={this.props.width} height={this.props.height}
          viewBox={viewBox} fontSize="1"
          style={{border: 'solid 2px #333'}}>
        {positioned.map(this.props.renderNode)}
      </svg>
  }
}

export default Graph;
