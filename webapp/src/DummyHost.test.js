import GetDummyHostNodes, { CanonicalDummyHostKey } from './DummyHost';

var dummyGetter = new GetDummyHostNodes();

it('canonical key found for hash path', () => {
  expect(
    CanonicalDummyHostKey('dummy/jbenet/depviz#1')
  ).toBe('dummy/jbenet/depviz#1');
});

it('canonical key found for slash path', () => {
  expect(
    CanonicalDummyHostKey('dummy/jbenet/depviz/10')
  ).toBe('dummy/jbenet/depviz#10');
});

it('spacer hash key fails canonicalization', () => {
  expect(() =>
    CanonicalDummyHostKey('dummy/jbenet/depviz/#1')
  ).toThrowError('unrecognized dummy key: dummy/jbenet/depviz/#1');
});

it('example.com host crashes', () => {
  expect(() =>
    dummyGetter.GetNodes(
      'example.com/jbenet/depviz#1', function () {})
  ).toThrowError('unrecognized dummy key: example.com/jbenet/depviz#1');
});

it('dummy key fetches without crashing', () => {
  var nodes = [];
  function pushNodes(newNodes) {
    for (var index in newNodes) {
      if (Object.prototype.hasOwnProperty.call(newNodes, index)) {
        nodes.push(newNodes[index]);
      }
    }
  }
  return dummyGetter.GetNodes('dummy/jbenet/depviz#3', pushNodes);
});

it('repo key fetches without crashing', () => {
  var nodes = [];
  function pushNodes(newNodes) {
    for (var index in newNodes) {
      if (Object.prototype.hasOwnProperty.call(newNodes, index)) {
        nodes.push(newNodes[index]);
      }
    }
  }
  return dummyGetter.GetNodes('dummy/jbenet/depviz', pushNodes);
});

it('user key fetches without crashing', () => {
  var nodes = [];
  function pushNodes(newNodes) {
    for (var index in newNodes) {
      if (Object.prototype.hasOwnProperty.call(newNodes, index)) {
        nodes.push(newNodes[index]);
      }
    }
  }
  return dummyGetter.GetNodes('dummy/jbenet', pushNodes);
});

it('non-status fetches without crashing', () => {
  var nodes = [];
  function pushNodes(newNodes) {
    for (var index in newNodes) {
      if (Object.prototype.hasOwnProperty.call(newNodes, index)) {
        nodes.push(newNodes[index]);
      }
    }
  }
  return dummyGetter.GetNodes('dummy/jbenet/depviz#4', pushNodes);
});
