import ShallowEqual from './ShallowEqual';

it('matches empty objects', () => {
  expect(ShallowEqual({}, {})).toBe(true);
});

it('distinguishes key only in a', () => {
  expect(ShallowEqual({a: 1, b: 2}, {a: 1})).toBe(false);
});

it('distinguishes key only in b', () => {
  expect(ShallowEqual({a: 1}, {a: 1, b: 2})).toBe(false);
});
