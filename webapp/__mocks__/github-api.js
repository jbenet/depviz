class GitHub {
  getIssues(user, repo) {
    return new Issues(user, repo);
  }

  search() {
    return new Search();
  }
}

class Issues {
  constructor(user, repo) {
    this._user = user;
    this._repo = repo;
    this._calls = {};
  }

  _getIssue(number) {
    if (this._calls[number]) {
      throw new Error(
        'duplicate call for github.com/' +
        this._user + '/' + this._repo + '#' + number
      );
    }
    this._calls[number] = true;
    if (number > 100) {
      return Promise.reject(new Error(
        'error making request GET https://api.github.com/repos/' +
        this._user + '/' + this._repo + '/issues/' + number
      ));
    }

    var dependencies = function (number) {
      switch (number) {
      case 1:
        return ['#10'];
      case 3:
        return ['#2', 'd3/d3#4356', 'gitlab.com/foo/bar#234'];
      case 5:
        return ['#3'];
      case 7:
        return ['#3'];
      case 10:
        return ['#3', '#7', '#5'];
      case 20:
        return ['foo/#3']; /* will be skipped */
      default:
        return [];
      }
    };
    var bodyLines = dependencies(number).map(function (dep) {
      return 'depends on ' + dep;
    });
    bodyLines.push('');
    bodyLines.push('- [ ] an uncompleted task');
    bodyLines.push('- [x] a completed task');
    return {
      body: bodyLines.join('\n') + '\n',
      html_url: `https://github.com/${this._user}/${this._repo}/issues/${number}`,
      number: number,
      repository_url: `https://api.github.com/repos/${this._user}/${this._repo}`,
      state: number < 10 ? 'open' : 'closed',
      title: 'Some title for ' + number,
      user: {
        login: 'author' + number,
      },
    };
  }

  getIssue(number) {
    return Promise.resolve({data: this._getIssue(number)});
  }

  listIssues() {
    return Promise.resolve({
      data: [
        this._getIssue(1),
        this._getIssue(2),
      ]
    });
  }
}

export class Search {
  forIssues(options) {
    var issues = new Issues('jbenet', 'depviz');
    return issues.listIssues();
  }
}

export default GitHub;
