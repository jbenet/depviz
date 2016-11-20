import React, { Component } from 'react';
import { Red, Green, Neutral } from './Color';

class DepIndicator extends Component {
  render() {
    var style = {
      fill: this.props.color,
      strokeWidth: 0,
    };
    var attributes = {};
    if (this.props.transform) {
      attributes.transform = this.props.transform;
    }
    return <g className="DepIndicator" {...attributes}>
      <circle cx={this.props.cx} cy={this.props.cy} r="1" style={style}>
          </circle>
      <text x={this.props.cx} y={this.props.cy}
          textAnchor="middle" dominantBaseline="central">
        {this.props.count}
      </text>
    </g>
  }
}

class DependenciesIndicator extends Component {
  render() {
    var count, color;
    if (this.props.blockers) {
      count = this.props.blockers;
      color = Red;
    } else {
      count = this.props.dependencies;
      color = Green;
    }
    var attributes = {};
    if (this.props.transform) {
      attributes.transform = this.props.transform;
    }
    return <DepIndicator
      cx={this.props.cx} cy={this.props.cy}
      count={count} color={color} {...attributes} />
  }
}

class RelatedIndicator extends Component {
  render() {
    var attributes = {};
    if (this.props.transform) {
      attributes.transform = this.props.transform;
    }
    return <DepIndicator
      cx={this.props.cx} cy={this.props.cy}
      count={this.props.related} color={Neutral} {...attributes} />
  }
}

class DependentsIndicator extends Component {
  render() {
    var color = this.props.done ? Green : Red;
    var attributes = {};
    if (this.props.transform) {
      attributes.transform = this.props.transform;
    }
    return <DepIndicator
      cx={this.props.cx} cy={this.props.cy}
      count={this.props.dependents} color={color} {...attributes} />
  }
}

class DepIndicators extends Component {
  render() {
    var relatedX = this.props.cx;
    if (this.props.dy < 1.75) {
      relatedX += 1;
    }
    return <g className="DepIndicators">
      <DependenciesIndicator
        cx={this.props.cx} cy={this.props.cy}
        transform={'translate(0, -' + this.props.dy + ')'}
        blockers={this.props.blockers}
        dependencies={this.props.dependencies} />
      <DependentsIndicator
        cx={this.props.cx} cy={this.props.cy}
        transform={'translate(0, ' + this.props.dy + ')'}
        dependents={this.props.dependents}
        done={this.props.done} />
      <RelatedIndicator
        cx={relatedX} cy={this.props.cy}
        related={this.props.related} />
    </g>
  }
}

export default DepIndicators;
