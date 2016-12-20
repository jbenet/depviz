import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './Layout';

it('renders without crashing', () => {
  const div = document.createElement('div');
  var router = jest.fn();
  ReactDOM.render(
    <Layout router={router} location={{pathname: '/', query: {}}} />,
    div
  );
});

it('preserves query parameters through jumps', () => {
  const div = document.createElement('div');
  var router = {push: jest.fn()};
  ReactDOM.render(
    <Layout router={router} location={{pathname: '/', query: {foo: 'bar'}}} />,
    div,
    function () {
      this.jump('/config');
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toHaveBeenCalledWith({
        pathname: '/config',
        query: {foo: 'bar'},
      });
    },
  );
});

it('generates expected jump sizes', () => {
  const div = document.createElement('div');
  var router = jest.fn();
  ReactDOM.render(
    <Layout router={router} location={{pathname: '/', query: {}}} />,
    div,
    function () {
      expect(this.getJumpSize(630)).toBe(40);
      expect(this.getJumpSize(530)).toBe(40);
      expect(this.getJumpSize(430)).toBe(27);
      expect(this.getJumpSize(330)).toBe(15);
      expect(this.getJumpSize(230)).toBe(15);
    }
  );
});
