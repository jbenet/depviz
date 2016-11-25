import React, { Component } from 'react';
import { Link } from 'react-router'
import logo from './logo/depviz.svg';
import './Layout.css';

/* sync with CSS .Layout-header padding and .Layout-logo height. */
export const HeaderHeight = 40;

class Layout extends Component {
  render() {
    return <div className="Layout">
      <div className="Layout-header">
        <Link to="/">
          <img src={logo} className="Layout-logo" alt="logo (homepage)" />
        </Link>
      </div>
      {this.props.children}
    </div>
  }
}

export default Layout;
