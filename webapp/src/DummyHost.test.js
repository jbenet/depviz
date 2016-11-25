import GetDummyHostNode from './DummyHost';

it('example.com host crashes', () => {
  expect(() =>
    GetDummyHostNode('example.com/jbenet/depviz#1')
  ).toThrowError('unrecognized dummy key: example.com/jbenet/depviz#1');
});
