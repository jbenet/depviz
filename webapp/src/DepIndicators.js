import React, { PureComponent } from 'react';
import { Red, Green, Neutral } from './Color';

export class DepIndicator extends PureComponent {
  render() {
    var pie;
    var radius = 1;
    var style = {
      fill: this.props.color,
      strokeWidth: 0,
    };
    if (this.props.pie && this.props.pie.fraction) {
      if (this.props.pie.fraction === 1) {
        style.fill = this.props.pie.color;
      } else {
        var pieStyle= {
          fill: this.props.pie.color,
          stroke: this.props.pie.color,
          strokeWidth: 0.02,
        };
        var largeArc = this.props.pie.fraction > 0.5 ? 1 : 0;
        var angle = 2 * Math.PI * this.props.pie.fraction;
        var x = this.props.cx + radius * Math.sin(angle);
        var y = this.props.cy - radius * Math.cos(angle);
        var pieD = [
          `M ${this.props.cx} ${this.props.cy}`,
          `L ${this.props.cx} ${this.props.cy - radius}`,
          `A ${radius} ${radius} 0 ${largeArc} 1 ${x} ${y}`,
          `Z`,
        ];
        pie = <path d={pieD.join(' ')} style={pieStyle}></path>
      }
    }
    return <g className="DepIndicator">
      <title>{this.props.title}</title>
      <circle cx={this.props.cx} cy={this.props.cy} r={radius} style={style}>
      </circle>
      {pie}
      <text x={this.props.cx} y={this.props.cy}
          textAnchor="middle" dominantBaseline="central"
          style={{fontWeight: 'bold', fill: 'white'}}>
        {this.props.count}
      </text>
    </g>
  }
}

class DependenciesIndicator extends PureComponent {
  render() {
    var count, color, title, pie;
    if (this.props.blockers) {
      count = this.props.blockers;
      color = Red;
      title = `${count} blockers (of ${this.props.dependencies} dependencies)`;
      pie = {
        color: Green,
        fraction: 1 - count / this.props.dependencies,
      };
    } else {
      count = this.props.dependencies;
      color = Green;
      title = `${this.props.dependencies} dependencies (no blockers)`;
    }
    return <DepIndicator
      title={title} cx={this.props.cx} cy={this.props.cy}
      count={count} color={color} pie={pie} />
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
