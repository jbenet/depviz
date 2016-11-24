import React from 'react';
import ReactDOM from 'react-dom';
import DepGraph from './DepGraph';
import GetDummyHostNode from './DummyHost';
import GetNode, { Getters } from './GetNode';

Getters['dummy'] = GetDummyHostNode;

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <DepGraph width={800} height={600}
      slugs={[
        'dummy/jbenet/depviz#1',
        'dummy/jbenet/depviz#6']}
      getNode={GetNode} />,
    div,
  );
});

it('missing getNode crashes', () => {
  const div = document.createElement('div');
  expect(() => ReactDOM.render(
    <DepGraph width={800} height={600}
      slugs={['dummy/jbenet/depviz#7']} />,
    div,
  )).toThrowError('getNode unset');
});

it('foobar host crashes', () => {
  const div = document.createElement('div');
  expect(() => ReactDOM.render(
    <DepGraph width={800} height={600}
      slugs={['foobar/jbenet/depviz#7']} getNode={GetNode} />,
    div
  )).toThrowError('unrecognized key host: foobar/jbenet/depviz#7');
});

it('missing issue crashes', () => {
  const div = document.createElement('div');
  expect(() => ReactDOM.render(
    <DepGraph width={800} height={600}
      slugs={['dummy/jbenet/depviz#999999999']} getNode={GetNode} />,
    div
  )).toThrowError(
    'error making request GET https://example.com/jbenet/depviz/issue/999999999'
  );
});

it('invalid key crashes', () => {
  const div = document.createElement('div');
  expect(() => ReactDOM.render(
    <DepGraph width={800} height={600}
      slugs={['dummy/jbenet/depviz#-1']} getNode={GetNode} />,
    div
  )).toThrowError('unrecognized dummy key: dummy/jbenet/depviz#-1');
});

it('does not duplicate requests for loaded nodes', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <DepGraph width={800} height={600}
      slugs={['dummy/jbenet/depviz#7', 'dummy/jbenet/depviz#7']}
      getNode={GetNode} />,
    div
  );
});
