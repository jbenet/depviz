import React, { Component } from 'react';
import './DepIndicator.css';

class DepIndicator extends Component {
  render() {
    return (
      <div className={"DepIndicator DepState-" + this.props.state}>
        {this.props.count}
      </div>
    );
  }
}

DepIndicator.defaultProps = {
  count: 0,
  state: 0,
}

export default DepIndicator;
