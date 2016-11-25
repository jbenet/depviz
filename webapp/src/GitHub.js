import GitHub from 'github-api';
import DepCard from './DepCard';

const gh = new GitHub(); /* unauthenticated client */

export function CanonicalGitHubKey(key) {
  var match = /^github\.com\/([^\/#]+)\/([^\/#]+)(\/|\/issues\/|\/pull\/|)(#?)([0-9]+)$/.exec(key);
  if (!match) {
    throw new Error('unrecognized GitHub key: ' + key);
  }
  var user = match[1];
  var repo = match[2];
  var spacer = match[3];
  var hash = match[4]
  var number = parseInt(match[5], 10);
  if (spacer && hash) {
    throw new Error('unrecognized GitHub key: ' + key);
  }

  return 'github.com/' + user + '/' + repo + '#' + number;
}

function nodeFromIssue(issue) {
  var dependencies = [];
  var related = [];
  var regexp = /^depends +on +(?:([^ ]+)\/)?(?:([^ ]+))?(?:#([0-9]+)) *$/gim;
  // FIXME: look for related too
  var match;
  match = /^.*\/([^\/]+)\/([^\/]+)$/.exec(issue.repository_url);
  if (match === null) {
    throw new Error(
      'unrecognized repository URL format: ' + issue.repository_url
    );
  }
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
  return new DepCard({
    slug: key,
    host: 'github.com',
    title: issue.title,
    href: issue.html_url,
    done: issue.state !== 'open',
    dependencies: dependencies,
    related: related,
    user: issue.user.login,
  });
}

function GetGitHubNode(key) {
  var match = /^github\.com\/([^\/]*)\/([^\/]*)#([0-9]*)$/.exec(key);
  if (!match) {
    throw new Error('unrecognized GitHub key: ' + key);
  }
  var user = match[1];
  var repo = match[2];
  var number = parseInt(match[3], 10);
  return gh.getIssues(
    user, repo
  ).getIssue(
    number
  ).then(function (issue) {
    return nodeFromIssue(issue.data);
  });
}

export function GetGitHubRepoNodes(user, repo, pushNodes) {
    gh.getIssues(
      user, repo
    ).listIssues(
    ).then(function (issues) {
      var nodes = issues.data.map(nodeFromIssue);
      pushNodes(nodes);
    });
  }

export default GetGitHubNode;
