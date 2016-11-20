import React, { Component } from 'react';
import DepCard from './DepCard';
import Viz from 'viz.js';
import xml2js from 'xml2js';

class DepGraph extends Component {
  cards() {
    return {
      'github/d3/d3#4356': {
        host: 'github',
        title: 'd3/d3$4356',
        href: 'https://github.com/d3/d3/pull/4356',
        done: true,
      },
      'github/gviz/gviz-d3#32': {
        host: 'github',
        title: 'gviz/gviz-d3#32',
        href: 'https://github.com/d3/d3/pull/4356',
        done: true,
      },
      'github/jbenet/depviz#1': {
        host: 'github',
        title: 'jbenet/depviz#1',
        href: 'https://github.com/jbenet/depviz/issues/1',
        done: false,
        dependencies: [
          'github/jbenet/depviz#10',
        ],
      },
      'github/jbenet/depviz#2': {
        host: 'github',
        title: 'jbenet/depviz#2',
        href: 'https://github.com/jbenet/depviz/issues/2',
        done: true,
      },
      'github/jbenet/depviz#3': {
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
      },
      'github/jbenet/depviz#5': {
        host: 'github',
        title: 'jbenet/depviz#5',
        href: 'https://github.com/jbenet/depviz/issues/5',
        done: false,
        related: [
          'github/jbenet/depviz#3',
        ],
      },
      'github/jbenet/depviz#6': {
        host: 'github',
        title: 'jbenet/depviz#6',
        href: 'https://github.com/jbenet/depviz/issues/6',
        done: true,
        dependencies: [
          'github/d3/d3#4356',
          'github/gviz/gviz-d3#32',
        ],
      },
      'github/jbenet/depviz#7': {
        host: 'github',
        title: 'jbenet/depviz#7',
        href: 'https://github.com/jbenet/depviz/issues/7',
        done: false,
        dependencies: [
          'github/jbenet/depviz#3',
        ],
      },
      'github/jbenet/depviz#10': {
        host: 'github',
        title: 'jbenet/depviz#10',
        href: 'https://github.com/jbenet/depviz/issues/10',
        done: false,
        dependencies: [
          'github/jbenet/depviz#3',
          'github/jbenet/depviz#5',
          'github/jbenet/depviz#7',
        ],
      },
      'gitlab/foo/bar#234': {
        host: 'gitlab',
        title: 'foo/bar#234',
        href: 'https://gitlab.com/foo/bar/issues/234',
        done: true,
        dependencies: [
          'github/jbenet/depviz#2',
        ],
      },
    };
  }

  depCard(card) {
    return <DepCard
      key={card.host + '/' + card.title}
      cx={card.cx} cy={card.cy}
      host={card.host}
      title={card.title}
      href={card.href}
      blockers={card.blockers}
      dependencies={card.dependencyCount}
      related={card.relatedCount}
      dependents={card.dependentCount}
      done={card.done} />
  }

  graphvizName(key) {
    return key.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  graphviz(cards) {
    var gv = [
      'digraph {',
      '  node [shape=box];',
    ];
    var key, card, name;
    for (key in cards) {
      if (true) {
        card = cards[key];
        name = this.graphvizName(key);
        gv.push('  node [href=' + name + '] ' + name + ';');
      }
    }
    for (key in cards) {
      if (true) {
        card = cards[key];
        name = this.graphvizName(key);
        for (var index in card.dependencies) {
          if (true) {
            var dep = this.graphvizName(card.dependencies[index]);
            gv.push('  ' + name + ' -> ' + dep + ';');
          }
        }
      }
    }
    gv.push('}');
    return gv.join('\n');
  }

  positionCards(cards, width, height) {
    var gv = this.graphviz(cards);
    var svg = Viz(gv, {format: 'svg', engine: 'dot', scale: 2});
    var json, name, key, card;
    xml2js.parseString(svg, function (err, result) {
      /* FIXME: handle errors */
      console.log(err, result);
      json = result;
    });
    var gvWidth = parseFloat(json.svg['$'].width);
    var gvHeight = parseFloat(json.svg['$'].height);
    var scale = 0.15;
    for (key in cards) {
      if (true) {
        card = cards[key];
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
              card.cx = x;
              card.cy = y;
              break;
            }
          }
        }
      }
    }
    /* FIXME: record edges */
    return cards;
  }

  countDependencies(cards) {
    for (var key in cards) {
      if (true) {
        var card = cards[key];
        card.dependencyCount = card.dependencies ? card.dependencies.length : 0;
        card.relatedCount = card.related ? card.related.length : 0;
        card.dependentCount = 0;
        for (var k in cards) {
          if (cards[k].dependencies &&
              cards[k].dependencies.indexOf(key) !== -1) {
            card.dependentCount += 1;
          }
        }
      }
    }
    return cards;
  }

  render() {
    var userWidth = this.props.width / 10;
    var userHeight = this.props.height / 10;
    var cards = this.countDependencies(this.positionCards(
      this.cards(), userWidth, userHeight
    ));
    var values = []; /* I couldn't get babel-polyfill working for cards.values() */
    for (var key in cards) {
      if (true) {
        values.push(cards[key]);
      }
    }
    return <svg id="svg" xmlns="http://www.w3.org/2000/svg"
          width={this.props.width} height={this.props.height}
          viewBox={'0 0 ' + userWidth + ' ' + userHeight} fontSize="1">
        {values.map(this.depCard)}
      </svg>
  }
}

export default DepGraph;
