import DepCard from './DepCard';

var calls = {};

export function CanonicalDummyHostKey(key) {
  var match = /^dummy\/([^\/#]+)\/([^\/#]+)(\/|\/issues\/|)(#?)([0-9]+)$/.exec(key);
  if (!match) {
    throw new Error('unrecognized dummy key: ' + key);
  }
  var user = match[1];
  var repo = match[2];
  var spacer = match[3];
  var hash = match[4];
  var number = parseInt(match[5], 10);
  if (spacer && hash) {
    throw new Error('unrecognized dummy key: ' + key);
  }

  return 'dummy/' + user + '/' + repo + '#' + number;
}

/* Dummy host getter for testing. */
function GetDummyHostNode(key) {
  var match = /^dummy\/(.*)\/(.*)#([0-9]*)$/.exec(key);
  if (!match) {
    throw new Error('unrecognized dummy key: ' + key);
  }
  var user = match[1];
  var repo = match[2];
  var number = parseInt(match[3], 10);

  if (calls[key]) {
    //throw new Error('duplicate call for ' + key);
  }
  calls[key] = true;
  if (number > 100) {
    throw new Error(
      'error making request GET https://example.com/' +
      user + '/' + repo + '/issue/' + number
    );
  }

  var dependencies = function (number) {
    switch (number) {
    case 1:
      return ['dummy/jbenet/depviz#10'];
    case 3:
      return [
          'dummy/jbenet/depviz#2', 'dummy/d3/d3#4356', 'gitlab.com/foo/bar#234'];
    case 5:
      return ['dummy/jbenet/depviz#3'];
    case 7:
      return ['dummy/jbenet/depviz#3'];
    case 10:
      return [
          'dummy/jbenet/depviz#3',
          'dummy/jbenet/depviz#7',
          'dummy/jbenet/depviz#5'];
    default:
      return [];
    }
  };

  var done = function (number) {
    switch (number) {
    case 2:
    case 3:
    case 6:
      return true;
    default:
      return false;
    }
  };

  return Promise.resolve(new DepCard({
    slug: key,
    host: 'github.com', /* because we need a logo */
    title: 'dummy ' + key,
    href: 'https://example.com/' + user + '/' + repo + '/issue/' + number,
    done: done(number),
    dependencies: dependencies(number),
    related: [],
    user: 'author' + number,
  }));
}

export default GetDummyHostNode;
