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

it('handles GitHub token addition', () => {
  const div = document.createElement('div');
  var router = {replace: jest.fn()};
  ReactDOM.render(
    <Config
      router={router}
      location={{pathname: '/config', query: {}}} />,
    div,
    function() {
      this.handleGitHubToken({target: {
        value: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
      }});
      expect(router.replace).toHaveBeenCalledTimes(1);
      expect(router.replace).toHaveBeenCalledWith({
        pathname: '/config',
        query: {'github-token': 'da39a3ee5e6b4b0d3255bfef95601890afd80709'},
      });
    }
  );
});

it('handles GitHub token change', () => {
  const div = document.createElement('div');
  var router = {replace: jest.fn()};
  ReactDOM.render(
    <Config
      router={router}
      location={{pathname: '/config', query: {'github-token': 'da39a3ee5e6b4b0d3255bfef95601890afd80709'}}} />,
    div,
    function() {
      this.handleGitHubToken({target: {
        value: 'adc83b19e793491b1c6ea0fd8b46cd9f32e592fc',
      }});
      expect(router.replace).toHaveBeenCalledTimes(1);
      expect(router.replace).toHaveBeenCalledWith({
        pathname: '/config',
        query: {'github-token': 'adc83b19e793491b1c6ea0fd8b46cd9f32e592fc'},
      });
    }
  );
});

it('handles GitHub token removal', () => {
  const div = document.createElement('div');
  var router = {replace: jest.fn()};
  ReactDOM.render(
    <Config
      router={router}
      location={{pathname: '/config', query: {'github-token': 'da39a3ee5e6b4b0d3255bfef95601890afd80709'}}} />,
    div,
    function() {
      this.handleGitHubToken({target: {value: ''}});
      expect(router.replace).toHaveBeenCalledTimes(1);
      expect(router.replace).toHaveBeenCalledWith({
        pathname: '/config',
        query: {},
      });
    }
  );
});
