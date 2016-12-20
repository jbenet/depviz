import React from 'react';
import ReactDOM from 'react-dom';
import Config from './Config';

it('renders without crashing', () => {
  const div = document.createElement('div');
  var router = jest.fn();
  ReactDOM.render(
    <Config router={router} location={{pathname: '/config', query: {}}} />,
    div
  );
});

it('handles expanded check', () => {
  const div = document.createElement('div');
  var router = {replace: jest.fn()};
  ReactDOM.render(
    <Config router={router} location={{pathname: '/config', query: {}}} />,
    div,
    function() {
      this.handleExpanded({target: {checked: true}});
      expect(router.replace).toHaveBeenCalledTimes(1);
      expect(router.replace).toHaveBeenCalledWith({
        pathname: '/config',
        query: {expanded: 'true'},
      });
    }
  );
});

it('handles expanded uncheck', () => {
  const div = document.createElement('div');
  var router = {replace: jest.fn()};
  ReactDOM.render(
    <Config
      router={router}
      location={{pathname: '/config', query: {expanded: 'true'}}} />,
    div,
    function() {
      this.handleExpanded({target: {checked: false}});
      expect(router.replace).toHaveBeenCalledTimes(1);
      expect(router.replace).toHaveBeenCalledWith({
        pathname: '/config',
        query: {},
      });
    }
  );
});
