import React, { Component } from 'react';
import { Link } from 'react-router'
import logo from './logo/react.svg';
import './Layout.css';

/* sync with CSS .Layout-logo and .Layout h1 height. */
export const HeaderHeight = 40;

class Layout extends Component {
  render() {
    return <div className="Layout">
      <div className="Layout-header">
        <a href="https://github.com/jbenet/depviz">
          <img src={logo} className="Layout-logo" alt="logo" />
        </a>
        <h1><Link to="/">depviz</Link></h1>
      </div>
      {this.props.children}
    </div>
  }
}

export default Layout;
