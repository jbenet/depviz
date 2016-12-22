import React, { Component } from 'react';
import Link from 'react-router/lib/Link';
import logo from './logo/depviz.svg';
import Jump from './Jump';
import ShallowEqual from './ShallowEqual';
import './Layout.css';

/* sync with CSS .Layout-header padding and .Layout-logo height. */
export const HeaderHeight = 40;

class Layout extends Component {
  componentWillMount() {
    if (!this.props.route.storage) {
      return;
    }
    var config = this.props.route.storage.getItem('depviz.config');
    if (config) {
      var query = JSON.parse(config);
      Object.assign(query, this.props.location.query);
      if (!ShallowEqual(query, this.props.location.query)) {
        this.props.router.replace({
          pathname: this.props.location.pathname,
          query: query,
        });
      }
    }
  }

  getJumpSize(width) {
    width = width === undefined ? window.innerWidth : width;
    const max = 40; /* number of chars we'd like if we have space */
    const min = 15; /* number of chars we require even if it will reflow */
    const maxCutoff = 530; /* width above which Jump is max */
    const minCutoff = 330; /* width below which Jump is min */
    if (width >= maxCutoff) {
      return max;
    } else if (width <= minCutoff) {
      return min;
    }
    return min + Math.max(0, Math.floor(
      (max - min) / (maxCutoff - minCutoff) * (width - minCutoff)
    ));
  }

  jump(pathname) {
    this.props.router.push({
      pathname: pathname,
      query: this.props.location.query,
    });
  }

  render() {
    var settingsLink, settingsStyle;
    if (this.props.location.pathname === '/config') {
      settingsStyle = {
        color: 'orange',
      };
      var query = Object.assign({}, this.props.location.query);
      var back = query.back || '/';
      delete query.back;
      settingsLink = {
        pathname: back,
        query: query,
      };
    } else {
      settingsLink = {
        pathname: '/config',
        query: Object.assign({
          back: this.props.location.pathname,
        }, this.props.location.query),
      };
    }
    return <div className="Layout">
      <div className="Layout-header">
        <Link to={{pathname: '/', query: this.props.location.query}}>
          <img src={logo} className="Layout-logo" alt="logo (homepage)" />
        </Link>
        <Link className="Layout-header-icon" to={settingsLink} style={settingsStyle}>
          ⚙
        </Link>
        <Jump push={this.jump.bind(this)}
          getSize={this.getJumpSize.bind(this)} />
      </div>
      {this.props.children}
    </div>
  }
}

export default Layout;
