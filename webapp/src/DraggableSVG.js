import React, { PureComponent } from 'react';

class DraggableSVG extends PureComponent {
  constructor(props) {
    super(props);
    var size;
    if (this.props.getSize) {
      size = this.props.getSize();
    } else {
      size = {width: 400, height: 400};
    }
    this.state = {
      width: size.width,
      height: size.height,
      dx: 0,
      dy: 0,
      start: null,
    };
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  updateDimensions() {
    var size;
    if (this.props.getSize) {
      size = this.props.getSize();
    } else {
      size = {width: 400, height: 400};
    }
    this.setState({width: size.width, height: size.height});
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

  userWidth() {
    return this.state.width / this.props.scale;
  }

  userHeight() {
    return this.state.height / this.props.scale;
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
    var x, y;
    if (event.type === 'mousedown') {
      x = event.clientX;
      y = event.clientY;
    } else if (event.type === 'touchstart') {
      var touch = event.changedTouches[0];
      x = touch.pageX;
      y = touch.pageY;
    }
    this.setState({start: [x, y]});
  }

  stopDrag(event) {
    this.setState({start: null});
  }

  handleDrag(event) {
    var x, y;
    if (event.type === 'mousemove') {
      x = event.clientX;
      y = event.clientY;
    } else if (event.type === 'touchmove') {
      var touch = event.changedTouches[0];
      x = touch.pageX;
      y = touch.pageY;
    }
    if (this.state.start) {
      this.setState({
        dx: this.state.dx + (this.state.start[0] - x) / this.props.scale,
        dy: this.state.dy + (this.state.start[1] - y) / this.props.scale,
        start: [x, y],
      });
    }
  }

  /* Properties:
   *
   * * getSize() -> {width: ..., height: ...}, (optional) callback for
   *   getting the graph viewport in pixels.
   * * scale, the ratio between viewport pixels and user units.
   */
  render() {
    return <svg xmlns="http://www.w3.org/2000/svg"
      width={this.state.width} height={this.state.height}
      viewBox={this.viewBox()} fontSize="1"
      onMouseDown={this.startDrag.bind(this)}
      onMouseUp={this.stopDrag.bind(this)}
      onMouseOut={this.stopDrag.bind(this)}
      onMouseMove={this.handleDrag.bind(this)}
      onTouchStart={this.startDrag.bind(this)}
      onTouchMove={this.handleDrag.bind(this)}
      onTouchEnd={this.stopDrag.bind(this)}
      onTouchCancel={this.stopDrag.bind(this)}>
    {this.props.children}
   </svg>
  }
}

export default DraggableSVG;
