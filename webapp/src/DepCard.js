import React, { PureComponent } from 'react';
import asana from './logo/asana.svg';
import github from './logo/github.svg';
import gitlab from './logo/gitlab.svg';
import { Bad, Good, Neutral } from './Color';
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
    var dependencies = this.props.dependencies || [];
    for (var index in dependencies) {
      if (Object.prototype.hasOwnProperty.call(dependencies, index)) {
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
      if (Object.prototype.hasOwnProperty.call(nodes, dependentKey)) {
        if (nodes[dependentKey].parents().indexOf(this.props.slug) !== -1) {
          count += 1;
        }
      }
    }
    return count;
  }

  depCard(cx, cy, nodes, pushNodes) {
    return <DepCard
      key={this.props.slug}
      cx={cx} cy={cy}
      slug={this.props.slug}
      host={this.props.host}
      title={this.props.title}
      href={this.props.href}
      parents={this.parents()}
      blockers={this.blockerCount(nodes || {})}
      dependencies={this.dependencyCount()}
      related={this.relatedCount()}
      dependents={this.dependentCount(nodes || {})}
      done={this.props.done}
      comments={this.props.comments}
      tasks={this.props.tasks}
      tasksCompleted={this.props.tasksCompleted}
      labels={this.props.labels}
      people={this.props.people}
      expanded={this.props.expanded}
      getNodes={this.props.getNodes}
      pushNodes={pushNodes} />
  }

  id(suffix) {
    var name = this.props.slug
      .replace(/^[^:A-Z_a-z]/g, '_')
      .replace(/[^:A-Z_a-z-.0-9]+/g, '_');
    if (suffix) {
      name += suffix;
    }
    return name;
  }

  render() {
    var width, height, comments, labels, people, tasks, title;
    var additionalIDTitle;
    var imageHeight = 1.5;
    var lineSep = 1.2;
    var radius = 0.5;
    if (this.props.expanded) {
      width = 24;
      height = imageHeight + 2 * lineSep + 2 * radius;
    } else {
      width = 15;
      height = Math.max(imageHeight + 2 * radius, 3);
    }
    var color = Neutral;
    var style = {
      fill: color,
      fillOpacity: 0.1,
      stroke: this.props.done ? Good : Bad,
      strokeWidth: 0.2,
    };
    if (!this.props.done && !this.props.blockers) {
      style.strokeWidth *= 2;
    }
    var backgroundStyle = {
      fill: 'white',
      stroke: 'none',
    };
    var taskStyle = {
      fill: Good,
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
    var rightCenter = right - radius;
    var rightColumn = rightCenter - 4;
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
    var idClipPath;
    if (this.props.expanded && this.props.people) {
      idClipPath = 'url(#' + this.id('_left_column') + ')';
    } else {
      idClipPath = 'url(#' + this.id('_full_width') + ')';
    }

    if (this.props.expanded) {
      var titleClipPath;
      if (this.props.comments) {
        titleClipPath = 'url(#' + this.id('_left_column') + ')';
      } else {
        titleClipPath = 'url(#' + this.id('_full_width') + ')';
      }
      title = <g>
        <title>{this.props.title}</title>
        <text x={leftCenter} y={topCenter + imageHeight + lineSep}
            clipPath={titleClipPath}>
          {this.props.title}
        </text>
      </g>
      if (this.props.labels) {
        var labelsClipPath;
        if (this.props.tasks) {
          labelsClipPath = 'url(#' + this.id('_left_column') + ')';
        } else {
          labelsClipPath = 'url(#' + this.id('_full_width') + ')';
        }
        var labelTitle = this.props.labels.map(function (label) {
          return label.name;
        }).join('\n');
        // FIXME: wrap in boxes using getComputedTextLength
        labels = this.props.labels.map(function (label) {
          return <tspan key={label.name} style={{fill: label.color}}>
            {label.name}
          </tspan>
        });
        for (var i = labels.length - 1; i > 0; i--) {
          labels.splice(i, 0, ' ');
        }
        labels = <g clipPath={labelsClipPath}>
          <title>{labelTitle}</title>
          <text x={leftCenter} y={topCenter + imageHeight + 2 * lineSep}>
            {labels}
          </text>
        </g>
      }
      if (this.props.people) {
        people = this.props.people.slice(0, 1).map(function (person) {
          var image;
          if (person.avatar) {
            image = <image
              x={rightColumn} y={topCenter}
              width={imageHeight} height={imageHeight}
              xlinkHref={person.avatar}>
            </image>
          } else {
            image = <text x={rightColumn} y={topCenter + lineSep}>
              😐
            </text>
          }
          return <a key={person.name} xlinkHref={person.url}>
            <title>{person.name}</title>
            {image}
          </a>
        });
      }
      if (this.props.comments) {
        comments = <text x={rightColumn} y={topCenter + imageHeight + lineSep}>
          🗪{this.props.comments}
        </text>
      }
      if (this.props.tasks) {
        tasks = <text x={rightColumn} y={topCenter + imageHeight + 2 * lineSep}>
          ☑{this.props.tasksCompleted}/{this.props.tasks}
        </text>
      }
    } else { /* collapsed */
      additionalIDTitle = '\n' + this.props.title;
    }
    var unwalkedDependencies = this.props.done && this.props.parents.length;
    return <g className="DepCard" xmlnsXlink="http://www.w3.org/1999/xlink">
      <clipPath id={this.id('_full_width')}>
        <rect x={left} y={top} width={width} height={height} />
      </clipPath>
      <clipPath id={this.id('_left_column')}>
        <rect x={left} y={top} width={rightColumn - left} height={height} />
      </clipPath>
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
          x={leftCenter} y={topCenter}
          width={imageHeight} height={imageHeight}
          xlinkHref={logo}>
        </image>
      </a>
      <a xlinkHref={this.props.href}>
        <title>
          {this.props.slug}{additionalIDTitle}
        </title>
        <text
            x={leftCenter + imageHeight + 0.4}
            y={topCenter + 1}
            clipPath={idClipPath}>
          {this.props.slug.replace(/^[^\/]*\//, '')}
        </text>
      </a>
      {title}
      {labels}
      {people}
      {comments}
      {tasks}
      <DepIndicators
        cx={right} cy={this.props.cy} dy={height/2}
        parents={this.props.parents}
        blockers={this.props.blockers}
        dependencies={this.props.dependencies}
        related={this.props.related}
        dependents={this.props.dependents}
        done={this.props.done}
        getNodes={unwalkedDependencies ? this.props.getNodes : undefined}
        pushNodes={unwalkedDependencies ? this.props.pushNodes : undefined} />
    </g>
  }
}

export default DepCard;
