import React from 'react';
import ReactDOM from 'react-dom';
import DraggableSVG from './DraggableSVG';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <DraggableSVG scale={10}>
      <rect x={40} y={30} width={6} height={2}
        style={{fillOpacity: '0.1'}}>
      </rect>
    </DraggableSVG>,
    div
  );
});

it('drag and drop shifts viewBox', () => {
  const div = document.createElement('div');
  return new Promise(
    function (resolve, reject) {
      ReactDOM.render(
        <DraggableSVG scale={10}>
          <rect x={40} y={30} width={6} height={2}
            style={{fillOpacity: '0.1'}}>
          </rect>
        </DraggableSVG>,
        div,
        function () {
          this.handleDrag({type: 'mousemove', clientX: 30, clientY: 50});
          expect(this.state.dx).toBe(0);
          expect(this.state.dy).toBe(0);
          this.startDrag({type: 'mousedown', clientX: 10, clientY: 20});
          this.handleDrag({type: 'mousemove', clientX: 30, clientY: 50});
          expect(this.state.dx).toBe(-2);
          expect(this.state.dy).toBe(-3);
          this.stopDrag();
          expect(this.state.start).toBe(null);
          this.startDrag({
            type: 'touchstart',
            changedTouches: [{pageX: 10, pageY: 20}],
          });
          this.handleDrag({
            type: 'touchmove',
            changedTouches: [{pageX: 30, pageY: 50}],
          });
          expect(this.state.dx).toBe(-4);
          expect(this.state.dy).toBe(-6);
          this.stopDrag();
          expect(this.state.start).toBe(null);
          resolve();
        },
      );
    },
  );
});

it('mount / unmount cleans up resize event listener', () => {
  const div = document.createElement('div');
  var getSize = jest.fn();
  getSize.mockReturnValueOnce({width: 100, height: 100})
    .mockReturnValueOnce({width: 200, height: 200})
    .mockReturnValueOnce({width: 300, height: 300})
    .mockReturnValueOnce({width: 400, height: 400});
  return new Promise(
    function (resolve, reject) {
      ReactDOM.render(
        <DraggableSVG getSize={getSize} scale={10}>
          <rect x={40} y={30} width={6} height={2}
            style={{fillOpacity: '0.1'}}>
          </rect>
        </DraggableSVG>,
        div,
        function () {
          expect(this.state.width).toBe(200);
          expect(this.state.height).toBe(200);
          var event = new Event('resize');
          window.dispatchEvent(event);
          expect(this.state.width).toBe(300);
          expect(this.state.height).toBe(300);
          this.componentWillUnmount();
          window.dispatchEvent(event);
          expect(this.state.width).toBe(300);
          expect(this.state.height).toBe(300);
          resolve();
        },
      );
    },
  );
});
