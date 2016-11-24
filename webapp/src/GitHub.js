import GitHub from 'github-api';
import DepCard from './DepCard';

const gh = new GitHub(); /* unauthenticated client */

function GetGitHubNode(key) {
  var match = /^github\/(.*)\/(.*)#([0-9]*)$/.exec(key);
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
    var dependencies = [];
    var related = [];
    var regexp = /^depends +on +(?:([^ ]+)\/)?(?:([^ ]+))?(?:#([0-9]+)) *$/gim;
    // FIXME: look for related too
    var match;
    for (;;) {
      match = regexp.exec(issue.data.body);
      if (match === null) {
        break;
      }
      var user1 = match[1];
      var repo1 = match[2];
      var number1 = parseInt(match[3], 10);
      if ((user1 && !repo1) || (!user1 && repo1)) {
        continue;
      }
      if (!user1 && !repo1) {
        user1 = user;
        repo1 = repo;
      }
      var relatedKey = 'github/' + user1 + '/' + repo1 + '#' + number1;
      dependencies.push(relatedKey);
    }
    return new DepCard({
      slug: key,
      host: 'github',
      title: issue.data.title,
      href: issue.data.html_url,
      done: issue.data.state !== 'open',
      dependencies: dependencies,
      related: related,
      user: issue.data.user.login,
    });
  });
}

export default GetGitHubNode;
