import GetGitHubNodes, { CanonicalGitHubKey } from './GitHub';

it('canonical key found for hash path', () => {
  expect(
    CanonicalGitHubKey('github.com/jbenet/depviz#1')
  ).toBe('github.com/jbenet/depviz#1');
});

it('canonical key found for slash path', () => {
  expect(
    CanonicalGitHubKey('github.com/jbenet/depviz/1')
  ).toBe('github.com/jbenet/depviz#1');
});

it('canonical key found for issues path', () => {
  expect(
    CanonicalGitHubKey('github.com/jbenet/depviz/issues/1')
  ).toBe('github.com/jbenet/depviz#1');
});

it('canonical key found for pull path', () => {
  expect(
    CanonicalGitHubKey('github.com/jbenet/depviz/pull/1')
  ).toBe('github.com/jbenet/depviz#1');
});

it('spacer hash key fails canonicalization', () => {
  expect(() =>
    CanonicalGitHubKey('github.com/jbenet/depviz/#1')
  ).toThrowError('unrecognized GitHub key: github.com/jbenet/depviz/#1');
});

it('spacer without repo fails canonicalization', () => {
  expect(() =>
    CanonicalGitHubKey('github.com/jbenet/#1')
  ).toThrowError('unrecognized GitHub key: github.com/jbenet/#1');
});

it('example.com host fails canonicalization', () => {
  expect(() =>
    CanonicalGitHubKey('example.com/jbenet/depviz#1')
  ).toThrowError('unrecognized GitHub key: example.com/jbenet/depviz#1');
});

it('example.com host fails node lookup', () => {
  var pushNode = jest.fn();
  expect(() =>
    GetGitHubNodes('example.com/jbenet/depviz#1', pushNode)
  ).toThrowError('unrecognized GitHub key: example.com/jbenet/depviz#1');
});

it('foo/#3 reference is skipped without crashing', () => {
  var nodes = [];
  function pushNodes(newNodes) {
    for (var index in newNodes) {
      if (true) {
        nodes.push(newNodes[index]);
      }
    }
  }
  return new Promise(function (resolve, reject) {
    GetGitHubNodes(
     'github.com/jbenet/depviz#20', pushNodes
    ).then(function () {
      expect(nodes.length).toBe(1);
      expect(nodes[0].parents().length).toBe(0);
      resolve();
    }).catch(reject);
  });
});

it('long and short references are understood', () => {
  var nodes = [];
  function pushNodes(newNodes) {
    for (var index in newNodes) {
      if (true) {
        nodes.push(newNodes[index]);
      }
    }
  }
  return new Promise(function (resolve, reject) {
    GetGitHubNodes(
      'github.com/jbenet/depviz#3', pushNodes
    ).then(function() {
      expect(nodes.length).toBe(1);
      var parents = nodes[0].parents();
      expect(parents.length).toBe(3);
      expect(parents[0]).toBe('github.com/jbenet/depviz#2');
      resolve();
    }).catch(reject);
  });
});

it('repository keys are understood', () => {
  var nodes = [];
  function pushNodes(newNodes) {
    for (var index in newNodes) {
      if (true) {
        nodes.push(newNodes[index]);
      }
    }
  }
  return new Promise(function (resolve, reject) {
    GetGitHubNodes(
      'github.com/jbenet/depviz', pushNodes
    ).then(function() {
      expect(nodes.length).toBe(2);
      resolve();
    }).catch(reject);
  });
});

it('user keys are understood', () => {
  var nodes = [];
  function pushNodes(newNodes) {
    for (var index in newNodes) {
      if (true) {
        nodes.push(newNodes[index]);
      }
    }
  }
  return new Promise(function (resolve, reject) {
    GetGitHubNodes(
      'github.com/jbenet', pushNodes
    ).then(function() {
      expect(nodes.length).toBe(2);
      resolve();
    }).catch(reject);
  });
});
