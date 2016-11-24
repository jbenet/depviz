import React, { PureComponent } from 'react';

class DraggableSVG extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dx: 0,
      dy: 0,
      start: null,
    };
    this.startDrag = this.startDrag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  userWidth() {
    return this.props.width / this.props.scale;
  }

  userHeight() {
    return this.props.height / this.props.scale;
  }

  viewBox() {
    return [
      this.state.dx,
      this.state.dy,
      this.userWidth(),
      this.userHeight(),
    ].join(' ');
  }

  startDrag(event) {
    this.setState({start: [event.clientX, event.clientY]});
  }

  stopDrag(event) {
    this.setState({start: null});
  }

  handleMouseMove(event) {
    if (this.state.start) {
      this.setState({
        dx: this.state.dx + (
          this.state.start[0] - event.clientX) / this.props.scale,
        dy: this.state.dy + (
          this.state.start[1] - event.clientY) / this.props.scale,
        start: [event.clientX, event.clientY],
      });
    }
  }

  /* Properties:
   *
   * * width, the width of the graph viewport in pixels.
   * * height, the height of the graph viewport in pixels.
   * * scale, the ratio between viewport pixels and user units.
   */
  render() {
    return <svg xmlns="http://www.w3.org/2000/svg"
      width={this.props.width} height={this.props.height}
      viewBox={this.viewBox()} fontSize="1"
      onMouseDown={this.startDrag}
      onMouseUp={this.stopDrag}
      onMouseOut={this.stopDrag}
      onMouseMove={this.handleMouseMove}>
    {this.props.children}
   </svg>
  }
}

export default DraggableSVG;
