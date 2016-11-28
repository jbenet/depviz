import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './Layout';

it('renders without crashing', () => {
  const div = document.createElement('div');
  var router = jest.fn();
  ReactDOM.render(
    <Layout router={router} />,
    div
  );
});

it('generated expected jump sizes', () => {
  const div = document.createElement('div');
  var router = jest.fn();
  ReactDOM.render(
    <Layout router={router} />,
    div,
    function () {
			expect(this.getJumpSize(600)).toBe(40);
			expect(this.getJumpSize(500)).toBe(40);
      expect(this.getJumpSize(400)).toBe(27);
			expect(this.getJumpSize(300)).toBe(15);
			expect(this.getJumpSize(200)).toBe(15);
    }
  );
});
