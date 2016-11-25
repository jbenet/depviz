import GetDummyHostNode, { CanonicalDummyHostKey } from './DummyHost';

it('canonical key found for hash path', () => {
  expect(
    CanonicalDummyHostKey('dummy/jbenet/depviz#1')
  ).toBe('dummy/jbenet/depviz#1');
});

it('canonical key found for slash path', () => {
  expect(
    CanonicalDummyHostKey('dummy/jbenet/depviz/1')
  ).toBe('dummy/jbenet/depviz#1');
});

it('spacer hash key fails canonicalization', () => {
  expect(() =>
    CanonicalDummyHostKey('dummy/jbenet/depviz/#1')
  ).toThrowError('unrecognized dummy key: dummy/jbenet/depviz/#1');
});

it('example.com host crashes', () => {
  expect(() =>
    GetDummyHostNode('example.com/jbenet/depviz#1')
  ).toThrowError('unrecognized dummy key: example.com/jbenet/depviz#1');
});
