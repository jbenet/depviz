import GitHub from 'github-api';
import DepCard from './DepCard';

var gh = new GitHub(); /* unauthenticated client */

export function SetGitHubAuth(auth) {
  gh = new GitHub(auth);
}

function parseKey(key) {
  var match = /^github\.com\/([^\/#]+)(\/?)([^\/#]*)(\/|\/issues\/|\/pull\/|)(#?)([0-9]*)$/.exec(key);
  if (!match) {
    throw new Error('unrecognized GitHub key: ' + key);
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
    throw new Error('unrecognized GitHub key: ' + key);
  }
  return data;
}

export function CanonicalGitHubKey(key) {
  var data = parseKey(key);
  key = 'github.com/' + data.user;
  if (data.repo) {
    key += '/' + data.repo;
  }
  if (data.number) {
    key += '#' + data.number;
  }
  return key;
}

function nodeFromIssue(issue, props, pushNodes) {
  props = Object.assign({}, props);
  props.host = 'github.com';
  props.title = issue.title;
  props.href = issue.html_url;
  props.done = issue.state !== 'open';
  props.comments = issue.comments;
  var regexp = /^depends +on +(?:([^ ]+)\/)?(?:([^ ]+))?(?:#([0-9]+)) *$/gim;
  // FIXME: look for related too
  var match;
  match = /^.*\/([^\/]+)\/([^\/]+)$/.exec(issue.repository_url);
  var issueUser = match[1];
  var issueRepo = match[2];
  props.slug = (
    'github.com/' + issueUser + '/' + issueRepo + '#' + issue.number
  );
  props.dependencies = [];
  props.related = [];
  for (;;) {
    match = regexp.exec(issue.body);
    if (match === null) {
      break;
    }
    var user = match[1];
    var repo = match[2];
    var number = parseInt(match[3], 10);
    if ((user && !repo) || (!user && repo)) {
      continue;
    }
    if (!user && !repo) {
      user = issueUser;
      repo = issueRepo;
    }
    var relatedKey = 'github.com/' + user + '/' + repo + '#' + number;
    props.dependencies.push(relatedKey);
  }
  props.tasks = 0;
  props.tasksCompleted = 0;
  regexp = /^[^[]*\[([ x])].*$/gm;
  for (;;) {
    match = regexp.exec(issue.body);
    if (match === null) {
      break;
    }
    var check = match[1];
    if (check === 'x') {
      props.tasksCompleted += 1;
    }
    props.tasks += 1;
  }
  props.labels = issue.labels.map(function (label) {
    return {
      name: label.name,
      color: '#' + label.color,
    }
  });
  if (issue.assignees.length) {
    props.people = issue.assignees.map(function (user) {
      return {
        name: user.login,
        url: user.html_url,
        avatar: user.avatar_url,
      }
    });
  } else {
    props.people = [{
      name: issue.user.login,
      url: issue.user.html_url,
      avatar: issue.user.avatar_url,
    }];
  }
  if (issue.pull_request && !props.done) {
    // getCombinedStatus https://github.com/github-tools/github/pull/397
    var _repo = gh.getRepo(issueUser, issueRepo);
    _repo._request(
      'GET',
      `/repos/${_repo.__fullname}/commits/refs/pull/${issue.number}/head/status`,
      null,
      function (error, status) {
        if (error) {
          console.log('throw', error, status);
          throw error;
        }
        props.status = status.state;
        pushNodes([new DepCard(props)]);
      }
    );
  }
  return new DepCard(props);
}

function GetGitHubNodes(key, pushNodes, props) {
  var data = parseKey(key);
  if (data.repo === undefined) {
    return gh.search().forIssues({
      q: `assignee:${data.user} is:open`,
    }).then(function (issues) {
      var nodes = issues.data.map(function (issue) {
        return nodeFromIssue(issue, props, pushNodes);
      });
      pushNodes(nodes);
    });
  }
  if (data.number === undefined) {
    return gh.getIssues(
      data.user, data.repo
    ).listIssues(
    ).then(function (issues) {
      var nodes = issues.data.map(function (issue) {
        return nodeFromIssue(issue, props, pushNodes);
      });
      pushNodes(nodes);
    });
  }
  return gh.getIssues(
    data.user, data.repo
  ).getIssue(
    data.number
  ).then(function (issue) {
    pushNodes([nodeFromIssue(issue.data, props, pushNodes)]);
  });
}

export default GetGitHubNodes;
