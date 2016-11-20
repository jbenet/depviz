import React, { Component } from 'react';
import { Neutral } from './Color';
import DepIndicators from './DepIndicators';

class DepCard extends Component {
  render() {
    var width = 15;
    var height = 3;
    var color = Neutral;
    var style = {
      fill: color,
      opacity: '0.1',
      strokeWidth: 0,
    };
    return <g className="DepCard">
      <rect
        x={this.props.cx - width/2} y={this.props.cy - height/2}
        width={width} height={height} rx="0.5" ry="0.5" style={style}>
      </rect>
      <text x={this.props.cx} y={this.props.cy}
          transform={'translate(' + (-width/2 + 0.5) + ', ' + (-height/2 + 1.5) + ')'}>
        {this.props.title}
      </text>
      <DepIndicators
        cx={this.props.cx + width/2} cy={this.props.cy} dy={height/2}
        dependencies={this.props.dependencies}
        related={this.props.related}
        dependents={this.props.dependents}
        done={this.props.done} />
    </g>
  }
}

export default DepCard;
