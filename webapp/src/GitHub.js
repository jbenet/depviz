import GitHub from 'github-api';
import DepCard from './DepCard';

const gh = new GitHub(); /* unauthenticated client */

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

function nodeFromIssue(issue) {
  var dependencies = [];
  var related = [];
  var regexp = /^depends +on +(?:([^ ]+)\/)?(?:([^ ]+))?(?:#([0-9]+)) *$/gim;
  // FIXME: look for related too
  var match;
  match = /^.*\/([^\/]+)\/([^\/]+)$/.exec(issue.repository_url);
  var issueUser = match[1];
  var issueRepo = match[2];
  var key = 'github.com/' + issueUser + '/' + issueRepo + '#' + issue.number;
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
    dependencies.push(relatedKey);
  }
  var tasks = 0;
  var tasksCompleted = 0;
  regexp = /^[^[]*\[([ x])].*$/gm;
  for (;;) {
    match = regexp.exec(issue.body);
    if (match === null) {
      break;
    }
    var check = match[1];
    if (check === 'x') {
      tasksCompleted += 1;
    }
    tasks += 1;
  }
  return new DepCard({
    slug: key,
    host: 'github.com',
    title: issue.title,
    href: issue.html_url,
    done: issue.state !== 'open',
    dependencies: dependencies,
    related: related,
    tasks: tasks,
    tasksCompleted: tasksCompleted,
    user: issue.user.login,
  });
}

function GetGitHubNodes(key, pushNodes) {
  var data = parseKey(key);
  if (data.repo === undefined) {
    return gh.search().forIssues({
      q: `assignee:${data.user} is:open`,
    }).then(function (issues) {
      var nodes = issues.data.map(nodeFromIssue);
      pushNodes(nodes);
    });
  }
  if (data.number === undefined) {
    return gh.getIssues(
      data.user, data.repo
    ).listIssues(
    ).then(function (issues) {
      var nodes = issues.data.map(nodeFromIssue);
      pushNodes(nodes);
    });
  }
  return gh.getIssues(
    data.user, data.repo
  ).getIssue(
    data.number
  ).then(function (issue) {
    pushNodes([nodeFromIssue(issue.data)]);
  });
}

export default GetGitHubNodes;
