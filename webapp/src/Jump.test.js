import React from 'react';
import ReactDOM from 'react-dom';
import Jump from './Jump';

it('renders without crashing', () => {
  const div = document.createElement('div');
  var push = jest.fn();
  ReactDOM.render(
    <Jump push={push} />,
    div
  );
});

it('change event fills (or clears) the value', () => {
  const div = document.createElement('div');
  var push = jest.fn();
  ReactDOM.render(
    <Jump push={push} />,
    div,
    function() {
      this.handleChange({target: {value: 'foo'}});
      this.forceUpdate();
      expect(this.state.value).toBe('foo');
      this.handleChange({target: {value: ''}});
      this.forceUpdate();
      expect(this.state.value).toBe('');
    }
  );
});

it('submit event jumps to the value', () => {
  const div = document.createElement('div');
  var push = jest.fn();
  ReactDOM.render(
    <Jump push={push} />,
    div,
    function() {
      this.handleChange({target: {value: 'foo'}});
      this.handleSubmit({preventDefault: jest.fn()});
      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith('http/foo');
    }
  );
});

it('submit event without value is a no-op', () => {
  const div = document.createElement('div');
  var push = jest.fn();
  ReactDOM.render(
    <Jump push={push} />,
    div,
    function() {
      this.handleSubmit({preventDefault: jest.fn()});
      expect(push).toHaveBeenCalledTimes(0);
    }
  );
});

it('mount / unmount cleans up resize event listener', () => {
  const div = document.createElement('div');
  var push = jest.fn();
  var getSize = jest.fn();
  getSize.mockReturnValueOnce(10)
    .mockReturnValueOnce(20)
    .mockReturnValueOnce(30)
    .mockReturnValueOnce(40);
  return new Promise(function (resolve, reject) {
    ReactDOM.render(
      <Jump getSize={getSize} push={push} />,
      div,
      function () {
        expect(this.state.size).toBe(10);
        var event = new Event('resize');
        window.dispatchEvent(event);
        expect(this.state.size).toBe(20);
        this.componentWillUnmount();
        window.dispatchEvent(event);
        expect(this.state.size).toBe(20);
        resolve();
      },
    );
  });
});
