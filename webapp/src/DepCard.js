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

  blockerCount(nodes) {
    var count = 0;
    for (var index in (this.props.dependencies || [])) {
      if (true) {
        var key = this.props.dependencies[index];
        if (nodes[key] !== undefined &&
            !nodes[key].props.done) {
          count += 1;
        }
      }
    }
    return count;
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
      blockers={this.blockerCount(nodes || {})}
      dependencies={this.dependencyCount()}
      related={this.relatedCount()}
      dependents={this.dependentCount(nodes || {})}
      done={this.props.done}
      tasks={this.props.tasks}
      tasksCompleted={this.props.tasksCompleted}
      user={this.props.user} />
  }

  render() {
    var width = 15;
    var height = 3;
    var radius = 0.5;
    var color = Neutral;
    var style = {
      fill: color,
      fillOpacity: 0.1,
      stroke: this.props.done ? Green : Red,
      strokeWidth: 0.2,
    };
    var backgroundStyle = {
      fill: 'white',
      stroke: 'none',
    };
    var taskStyle = {
      fill: Green,
      fillOpacity: 0.1,
      stroke: 'none',
    };
    var logo, host;
    if (this.props.host === 'asana.com') {
      logo = asana;
      host = 'https://asana.com/';
    } else if (this.props.host === 'github.com') {
      logo = github;
      host = 'https://github.com';
    } else if (this.props.host === 'gitlab.com') {
      logo = gitlab;
      host = 'https://gitlab.com';
    } else {
      throw new Error('unrecognized host: ' + this.props.host);
    }
    var taskRatio = 1;
    if (this.props.tasks) {
      taskRatio = this.props.tasksCompleted / this.props.tasks;
    } else {
      taskStyle.fill = 'white';
    }
    var left = this.props.cx - width/2;
    var right = this.props.cx + width/2;
    var leftCenter = left + radius;
    var rightTask = left + width * taskRatio;
    var top = this.props.cy - height/2;
    var bottom = this.props.cy + height/2;
    var topCenter = top + radius;
    var bottomCenter = bottom - radius;
    var taskPath = [
      `M ${left} ${topCenter}`,
      `A ${radius} ${radius} 0 0 1 ${leftCenter} ${top}`,
      `L ${rightTask} ${top}`,
      `L ${rightTask} ${bottom}`,
      `L ${leftCenter} ${bottom}`,
      `A ${radius} ${radius} 0 0 1 ${left} ${bottomCenter}`,
      `Z`,
    ];
    return <g className="DepCard" xmlnsXlink="http://www.w3.org/1999/xlink">
      <rect
        x={left} y={top} width={width} height={height}
        rx={radius} ry={radius} style={backgroundStyle}>
      </rect>
      <path d={taskPath.join(' ')} style={taskStyle} />
      <rect
        x={left} y={top} width={width} height={height}
        rx={radius} ry={radius} style={style}>
      </rect>
      <a xlinkHref={host}>
        <image
          x={leftCenter} y={this.props.cy - 0.4 * height}
          width={0.8 * height} height={0.8 * height}
          xlinkHref={logo}>
        </image>
      </a>
      <a xlinkHref={this.props.href}>
        <text
          x={leftCenter + height}
          y={this.props.cy - height/2 + 1.5}>
          {this.props.slug.replace(/^[^\/]*\//, '')}
        </text>
      </a>
      <DepIndicators
        cx={right} cy={this.props.cy} dy={height/2}
        blockers={this.props.blockers}
        dependencies={this.props.dependencies}
        related={this.props.related}
        dependents={this.props.dependents}
        done={this.props.done} />
    </g>
  }
}

export default DepCard;
