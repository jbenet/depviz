import React, { PureComponent } from 'react';
import './Jump.css';

class Jump extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {value: ''};
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.value) {
      this.props.push('http/' + this.state.value.replace(/#/g, '/'));
    }
  }

  render() {
    return <div className="Jump">
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input type="text" size={40}
          onChange={this.handleChange.bind(this)}
          placeholder="github.com/jbenet/depviz#1" />
        <input type="submit" value="Go" />
      </form>
    </div>
  }
}

export default Jump;
