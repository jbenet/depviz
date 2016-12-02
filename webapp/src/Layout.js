import React, { Component } from 'react';
import Link from 'react-router/lib/Link';
import logo from './logo/depviz.svg';
import Jump from './Jump';
import './Layout.css';

/* sync with CSS .Layout-header padding and .Layout-logo height. */
export const HeaderHeight = 40;

class Layout extends Component {
  getJumpSize(width) {
    width = width === undefined ? window.innerWidth : width;
    const max = 40; /* number of chars we'd like if we have space */
    const min = 15; /* number of chars we require even if it will reflow */
    const maxCutoff = 500; /* width above which Jump is max */
    const minCutoff = 300; /* width below which Jump is min */
    if (width >= maxCutoff) {
      return max;
    } else if (width <= minCutoff) {
      return min;
    }
    return min + Math.max(0, Math.floor(
      (max - min) / (maxCutoff - minCutoff) * (width - minCutoff)
    ));
  }

  render() {
    return <div className="Layout">
      <div className="Layout-header">
        <Link to="/">
          <img src={logo} className="Layout-logo" alt="logo (homepage)" />
        </Link>
        <Jump push={this.props.router.push}
          getSize={this.getJumpSize.bind(this)} />
      </div>
      {this.props.children}
    </div>
  }
}

export default Layout;
