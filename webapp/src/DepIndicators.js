import React, { PureComponent } from 'react';
import { Red, Green, Neutral } from './Color';

class DepIndicator extends PureComponent {
  render() {
    var style = {
      fill: this.props.color,
      strokeWidth: 0,
    };
    return <g className="DepIndicator">
      <title>{this.props.title}</title>
      <circle cx={this.props.cx} cy={this.props.cy} r="1" style={style}>
          </circle>
      <text x={this.props.cx} y={this.props.cy}
          textAnchor="middle" dominantBaseline="central">
        {this.props.count}
      </text>
    </g>
  }
}

class DependenciesIndicator extends PureComponent {
  render() {
    var count, color, title;
    if (this.props.blockers) {
      count = this.props.blockers;
      color = Red;
      title = `${count} blockers (of ${this.props.dependencies} dependencies)`;
    } else {
      count = this.props.dependencies;
      color = Green;
      title = `${this.props.dependencies} dependencies (no blockers)`;
    }
    return <DepIndicator
      title={title} cx={this.props.cx} cy={this.props.cy}
      count={count} color={color} />
  }
}

class RelatedIndicator extends PureComponent {
  render() {
    return <DepIndicator
      title={`${this.props.related} related issues`}
      cx={this.props.cx} cy={this.props.cy}
      count={this.props.related} color={Neutral} />
  }
}

class DependentsIndicator extends PureComponent {
  render() {
    var color = Neutral;
    if (this.props.dependents) {
      color = this.props.done ? Green : Red;
    }
    return <DepIndicator
      title={`${this.props.dependents} dependent issues`}
      cx={this.props.cx} cy={this.props.cy}
      count={this.props.dependents} color={color} />
  }
}

class DepIndicators extends PureComponent {
  render() {
    var relatedX = this.props.cx;
    if (this.props.dy < 1.75) {
      relatedX += 0.6;
    }
    return <g className="DepIndicators">
      <DependenciesIndicator
        cx={this.props.cx} cy={this.props.cy - this.props.dy}
        blockers={this.props.blockers}
        dependencies={this.props.dependencies} />
      <DependentsIndicator
        cx={this.props.cx} cy={this.props.cy + this.props.dy}
        dependents={this.props.dependents}
        done={this.props.done} />
      <RelatedIndicator
        cx={relatedX} cy={this.props.cy}
        related={this.props.related} />
    </g>
  }
}

export default DepIndicators;
