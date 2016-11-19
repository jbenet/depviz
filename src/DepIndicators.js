import React, { Component } from 'react';
import { Red, Green, Neutral } from './Color';

class DepIndicator extends Component {
  render() {
    var style = {
      stroke: this.props.color,
      fill: this.props.color,
    };
    return <g className="DepIndicator">
      <circle cx={this.props.cx} cy={this.props.cy} r="1em" style={style}>
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
    return <DepIndicator
      cx={this.props.cx} cy={this.props.cy}
      count={count} color={color} />
  }
}

class RelatedIndicator extends Component {
  render() {
    return <DepIndicator
      cx={this.props.cx} cy={this.props.cy}
      count={this.props.related} color={Neutral} />
  }
}

class DependentsIndicator extends Component {
  render() {
    var color = this.props.done ? Green : Red;
    return <DepIndicator
      cx={this.props.cx} cy={this.props.cy}
      count={this.props.dependents} color={color} />
  }
}

class DepIndicators extends Component {
  render() {
    return <g className="DepIndicators">
      <DependenciesIndicator
        cx={this.props.x} cy={this.props.y1}
        blockers={this.props.blockers}
        dependencies={this.props.dependencies} />
      <RelatedIndicator
        cx={this.props.x} cy={(this.props.y1 + this.props.y2) / 2}
        related={this.props.related} />
      <DependentsIndicator
        cx={this.props.x} cy={this.props.y2}
        dependents={this.props.dependents}
        done={this.props.done} />
    </g>
  }
}

export default DepIndicators;
