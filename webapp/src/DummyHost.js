import DepCard from './DepCard';

function parseKey(key) {
  var match = /^dummy\/([^\/#]+)(\/?)([^\/#]*)(\/|\/issues\/|)(#?)([0-9]*)$/.exec(key);
  if (!match) {
    throw new Error('unrecognized dummy key: ' + key);
  }
  var data = {user: match[1]};
  var spacer1 = match[2];
  if (match[3]) {
    data.repo = match[3];
  }
  var spacer2 = match[4];
  var hash = match[5]
  if (match[6]) {
    data.number = parseInt(match[6], 10);
  }
  if ((!spacer1 && data.repo) ||
      (!data.repo && (spacer2 || hash)) ||
      (spacer2 && hash)) {
    throw new Error('unrecognized dummy key: ' + key);
  }
  return data;
}

export function CanonicalDummyHostKey(key) {
  var data = parseKey(key);
  key = 'dummy/' + data.user;
  if (data.repo) {
    key += '/' + data.repo;
  }
  if (data.number) {
    key += '#' + data.number;
  }
  return key;
}

/* Dummy host getter for testing. */
class GetDummyHostNodes {
  constructor() {
    this.calls = {};
  }

  _getIssue(key) {
    var data = parseKey(key);
    if (this.calls[key]) {
      //throw new Error('duplicate call for ' + key);
      console.log('duplicate call for ' + key);
    }
    this.calls[key] = true;
    if (data.number > 100) {
      throw new Error(
        'error making request GET https://example.com/' +
        data.user + '/' + data.repo + '/issue/' + data.number
      );
    }

    var dependencies = function (number) {
      switch (number) {
      case 1:
        return ['dummy/jbenet/depviz#10'];
      case 3:
        return [
          'dummy/jbenet/depviz#2',
          'dummy/d3/d3#4356',
          'gitlab.com/foo/bar#234'];
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

    return new DepCard({
      slug: key,
      host: 'github.com', /* because we need a logo */
      title: 'dummy ' + key,
      href: `https://example.com/${data.user}/${data.repo}/issue/${data.number}`,
      done: done(data.number),
      dependencies: dependencies(data.number),
      related: [],
      tasks: Math.max(10, data.number),
      tasksCompleted: data.number,
      user: 'author' + data.number,
    })
  }

  GetNodes(key, pushNodes) {
    var data = parseKey(key);
    var nodes;
    if (data.number === undefined) {
      nodes = [
        this._getIssue('dummy/jbenet/depviz#1'),
        this._getIssue('dummy/jbenet/depviz#5'),
        this._getIssue('dummy/jbenet/depviz#7'),
        this._getIssue('dummy/jbenet/depviz#10'),
      ];
    } else {
      nodes = [this._getIssue(key)];
    }

    return new Promise(function (resolve, reject) {
      window.setTimeout(function() {
        pushNodes(nodes);
        resolve(nodes);
      }, 10);
    });
  }
}

export default GetDummyHostNodes;
