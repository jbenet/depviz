import React, { PureComponent } from 'react';
import asana from './logo/asana.svg';
import github from './logo/github.svg';
import gitlab from './logo/gitlab.svg';
import { Red, Green, Neutral } from './Color';
import DepIndicators from './DepIndicators';

class DepCard extends PureComponent {
  parents() {
    return this.props.dependencies ? this.props.dependencies : [];
  }

  dependencyCount() {
    return this.props.dependencies ? this.props.dependencies.length : 0;
  }

  relatedCount() {
    return this.props.related ? this.props.related.length : 0;
  }

  dependentCount(nodes) {
    var count = 0;
    for (var dependentKey in nodes) {
      if (true) {
        if (nodes[dependentKey].parents().indexOf(this.props.slug) !== -1) {
          count += 1;
        }
      }
    }
    return count;
  }

  depCard(cx, cy, nodes) {
    return <DepCard
      key={this.props.slug}
      cx={cx} cy={cy}
      slug={this.props.slug}
      host={this.props.host}
      title={this.props.title}
      href={this.props.href}
      blockers={this.props.blockers}
      dependencies={this.dependencyCount()}
      related={this.relatedCount()}
      dependents={this.dependentCount(nodes || {})}
      done={this.props.done} />
  }

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
    var backgroundStyle = {
      fill: 'white',
      stroke: 'white',
      strokeWidth: 0.1,
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
    } else {
      throw new Error('unrecognized host: ' + this.props.host);
    }
    return <g className="DepCard" xmlnsXlink="http://www.w3.org/1999/xlink">
      <rect
        x={this.props.cx - width/2} y={this.props.cy - height/2}
        width={width} height={height} rx="0.5" ry="0.5" style={backgroundStyle}>
      </rect>
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
          {this.props.slug.replace(/^[^\/]*\//, '')}
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
