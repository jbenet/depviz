import React, { PureComponent } from 'react';
import Viz from 'viz.js';
import xml2js from 'xml2js';
import DraggableSVG from './DraggableSVG';

class Graph extends PureComponent {
  nodeName(key) {
    return key.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  edgeName(key1, key2) {
    return this.nodeName(key1) + '__to__' + this.nodeName(key2);
  }

  graphviz(nodes) {
    var gv = [
      'digraph {',
      '  node [shape=box];', /* FIXME: node size */
    ];
    var key, name, node;
    for (key in nodes) {
      if (true) {
        node = nodes[key];
        name = this.nodeName(key);
        gv.push('  node [href=' + name + '] ' + name + ';');
      }
    }
    for (key in nodes) {
      if (true) {
        node = nodes[key];
        name = this.nodeName(key);
        var parents = node.parents();
        for (var index in parents) {
          if (true) {
            var parent = parents[index];
            var parentName = this.nodeName(parent);
            gv.push('  edge [href=' + this.edgeName(parent, key) + '] ' + parentName + ' -> ' + name + ';');
          }
        }
      }
    }
    gv.push('}');
    return gv.join('\n');
  }

  userCoord(x, y, gvTranslateX, gvTranslateY, gvWidth, gvHeight) {
    var userWidth = 0;
    var userHeight = 0;
    if (this.props.getSize) {
      const size = this.props.getSize();
      userWidth = size.width / this.props.scale;
      userHeight = size.height / this.props.scale;
    }
    x += gvTranslateX - gvWidth / 2;
    y += gvTranslateY - gvHeight / 2;
    x *= 0.15;
    y *= 0.15;
    x += userWidth / 2;
    y += userHeight / 2;
    return {x: x, y: y};
  }

  positionNodes(nodes) {
    if (Object.keys(nodes).length === 0) {
      return {
        edges: [],
        nodes: [],
      };
    }
    var gv = this.graphviz(nodes);
    var svg = Viz(gv, {format: 'svg', engine: 'dot', scale: 2});
    var g, index1, index2, json, name, node, node1, node2;
    xml2js.parseString(svg, function (err, result) {
      /* FIXME: handle errors */
      json = result;
    });
    var gvWidth = parseFloat(json.svg.$.width);
    var gvHeight = parseFloat(json.svg.$.height);
    var transform = json.svg.g[0].$.transform;
    var translateRegex = /.*translate\(([-0-9.]*) ([-0-9.]*)\).*/;
    var gvTranslateX = parseFloat(transform.replace(
      translateRegex,
      function (match, p1) {
        return p1;
      },
    ));
    var gvTranslateY = parseFloat(transform.replace(
      translateRegex,
      function (match, p1, p2) {
        return p2;
      },
    ));
    var positioned = [];
    for (var key in nodes) {
      if (true) {
        node = nodes[key];
        name = this.nodeName(key);
        for (index1 in json.svg.g[0].g) {
          if (true) {
            g = json.svg.g[0].g[index1];
            if (g.title[0] === name) {
              var text = g.g[0].a[0].text[0].$;
              var coord = this.userCoord(
                parseFloat(text.x), parseFloat(text.y),
                gvTranslateX, gvTranslateY, gvWidth, gvHeight);
              positioned.push({
                key: name,
                node: node,
                cx: coord.x,
                cy: coord.y,
              });
              break;
            }
          }
        }
      }
    }
    var edges = [];
    for (var k2 in nodes) {
      if (true) {
        node2 = nodes[k2];
        var parents = node2.parents();
        for (index1 in parents) {
          if (true) {
            var k1 = parents[index1];
            name = this.edgeName(k1, k2);
            node1 = nodes[k1];
            for (index2 in json.svg.g[0].g) {
              if (true) {
                g = json.svg.g[0].g[index2];
                if (g.title[0] === name.replace('__to__', '->')) {
                  // FIXME: parse from g.g[0].a[0].path[0].$.d and
                  // g.g[0].a[0].polygon[0].$.points
                  for (var j in positioned) {
                    if (positioned[j].key === this.nodeName(k1)) {
                      for (var k in positioned) {
                        if (positioned[k].key === this.nodeName(k2)) {
                          var x1 = positioned[j].cx;
                          var y1 = positioned[j].cy;
                          var x2 = positioned[k].cx;
                          var y2 = positioned[k].cy;
                          edges.push({
                            key: name,
                            node1: node1,
                            node2: node2,
                            path: ['M', x1, y1, 'L', x2, y2].join(' '),
                          });
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return {
      'edges': edges,
      'nodes': positioned,
    }
  }

  /* Properties:
   *
   * * getSize() -> {width: ..., height: ...}, (optional) callback for
   *   getting the graph viewport in pixels.
   * * scale, the ratio between viewport pixels and user units.
   * * nodes, an object with name keys and node values.  Nodes must
   *   support:
   *   * parents(), a method which returns an array of parent-node
   *     names.
   * * renderNode({node: ..., cx: ..., cy: ...), a method which
   *   renders a node in the graph.
   * * renderEdge({node1: ..., node2: ..., path: ...), a method which
   *   renders an edge in the graph.
   * * onKeyPress(event), (optional) callback for keypress events.
   */
  render() {
    var positioned = this.positionNodes(this.props.nodes);
    return <DraggableSVG
        getSize={this.props.getSize}
        scale={this.props.scale}
        onKeyPress={this.props.onKeyPress}>
      {this.props.children}
      {positioned.edges.map(this.props.renderEdge)}
      {positioned.nodes.map(this.props.renderNode)}
    </DraggableSVG>
  }
}

export default Graph;
