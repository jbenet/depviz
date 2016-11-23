import React, { PureComponent } from 'react';
import asana from './logo/asana.svg';
import github from './logo/github.svg';
import gitlab from './logo/gitlab.svg';
import { Red, Green, Neutral } from './Color';
import DepIndicators from './DepIndicators';

class DepCard extends PureComponent {
  render() {
    var width = 15;
    var height = 3;
    var color = Neutral;
    var style = {
      fill: color,
      fillOpacity: '0.1',
      stroke: this.props.done ? Green : Red,
      strokeWidth: 0.2,
    };
    var logo, host;
    if (this.props.host === 'asana') {
      logo = asana;
      host = 'https://asana.com/';
    } else if (this.props.host === 'github') {
      logo = github;
      host = 'https://github.com';
    } else if (this.props.host === 'gitlab') {
      logo = gitlab;
      host = 'https://gitlab.com';
    }
    return <g className="DepCard" xmlnsXlink="http://www.w3.org/1999/xlink">
      <rect
        x={this.props.cx - width/2} y={this.props.cy - height/2}
        width={width} height={height} rx="0.5" ry="0.5" style={style}>
      </rect>
      <a xlinkHref={host}>
        <image
          x={this.props.cx - width/2 + 0.5} y={this.props.cy - 0.4 * height}
          width={0.8 * height} height={0.8 * height}
          xlinkHref={logo}>
        </image>
      </a>
      <a xlinkHref={this.props.href}>
        <text
          x={this.props.cx - width/2 + 0.5 + height}
          y={this.props.cy - height/2 + 1.5}>
          {this.props.title}
        </text>
      </a>
      <DepIndicators
        cx={this.props.cx + width/2} cy={this.props.cy} dy={height/2}
        blockers={this.props.blockers}
        dependencies={this.props.dependencies}
        related={this.props.related}
        dependents={this.props.dependents}
        done={this.props.done} />
    </g>
  }
}

export default DepCard;
