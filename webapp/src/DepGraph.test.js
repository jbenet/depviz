import React from 'react';
import ReactDOM from 'react-dom';
import DepGraph from './DepGraph';
import GetDummyHostNodes, { CanonicalDummyHostKey } from './DummyHost';
import GetNodes, { Canonicalizers, Getters, CanonicalKey } from './GetNodes';

Canonicalizers['dummy'] = CanonicalDummyHostKey;
var dummyGetter = new GetDummyHostNodes();
Getters['dummy'] = dummyGetter.GetNodes.bind(dummyGetter);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <DepGraph width={800} height={600}
      slugs={[
        'dummy/jbenet/depviz#1',
        'dummy/jbenet/depviz#6']}
      getNodes={GetNodes} canonicalKey={CanonicalKey} />,
    div,
  );
});

it('missing getNodes crashes', () => {
  const div = document.createElement('div');
  expect(() => ReactDOM.render(
    <DepGraph width={800} height={600}
      slugs={['dummy/jbenet/depviz#7']} />,
    div,
  )).toThrowError('getNodes unset');
});

it('missing canonicalKey crashes', () => {
  const div = document.createElement('div');
  expect(() => ReactDOM.render(
    <DepGraph width={800} height={600}
      slugs={['dummy/jbenet/depviz#7']}
      getNodes={GetNodes} />,
    div,
  )).toThrowError('canonicalKey unset');
});

it('example.com host crashes', () => {
  const div = document.createElement('div');
  expect(() => ReactDOM.render(
    <DepGraph width={800} height={600}
      slugs={['example.com/jbenet/depviz#7']}
      getNodes={GetNodes} canonicalKey={CanonicalKey} />,
    div
  )).toThrowError('unrecognized key host: example.com/jbenet/depviz#7');
});

it('missing issue crashes', () => {
  const div = document.createElement('div');
  expect(() => ReactDOM.render(
    <DepGraph width={800} height={600}
      slugs={['dummy/jbenet/depviz#999999999']}
      getNodes={GetNodes} canonicalKey={CanonicalKey} />,
    div
  )).toThrowError(
    'error making request GET https://example.com/jbenet/depviz/issue/999999999'
  );
});

it('invalid key crashes', () => {
  const div = document.createElement('div');
  expect(() => ReactDOM.render(
    <DepGraph width={800} height={600}
      slugs={['dummy/jbenet/depviz#-1']}
      getNodes={GetNodes} canonicalKey={CanonicalKey} />,
    div
  )).toThrowError('unrecognized dummy key: dummy/jbenet/depviz#-1');
});

it('does not duplicate requests for loaded nodes', () => {
  const div = document.createElement('div');
  var dummyGetter = new GetDummyHostNodes();
  ReactDOM.render(
    <DepGraph width={800} height={600}
      slugs={[
        'dummy/jbenet/depviz#30',
        'dummy/jbenet/depviz#30',
      ]}
      getNodes={dummyGetter.GetNodes.bind(dummyGetter)}
      canonicalKey={CanonicalKey} />,
    div
  );
});
