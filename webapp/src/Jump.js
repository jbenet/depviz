import React, { PureComponent } from 'react';
import './Jump.css';

class Jump extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      size: 40,
      value: '',
    };
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  updateDimensions() {
    this.setState({
      size: this.props.getSize ? this.props.getSize() : 40,
    });
  }

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.value) {
      this.props.push('/http/' + this.state.value.replace(/#/g, '/'));
    }
  }

  render() {
    return <div className="Jump">
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input type="text" size={this.state.size}
          onChange={this.handleChange.bind(this)}
          placeholder="github.com/jbenet/depviz#1" />
        <input type="submit" value="Go" />
      </form>
    </div>
  }
}

export default Jump;
