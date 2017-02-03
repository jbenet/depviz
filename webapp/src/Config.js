import React, { PureComponent } from 'react';
import './Config.css';

class Config extends PureComponent {
  view() {
    return (
      this.props.location &&
      this.props.location.query.view
    );
  }

  handleView(event) {
    var query = Object.assign({}, this.props.location.query);
    if (event.currentTarget.value === 'list') {
      delete query.view;
    } else {
      query.view = event.currentTarget.value;
    }
    this.props.router.replace({
      pathname: this.props.location.pathname,
      query: query,
    });
  }

  handleGitHubToken(event) {
    var query = Object.assign({}, this.props.location.query);
    if (event.target.value) {
      query['github-token'] = event.target.value;
    } else {
      delete query['github-token'];
    }
    this.props.router.replace({
      pathname: this.props.location.pathname,
      query: query,
    });
  }

  render() {
    return <div className="Config">
      <h2 id="config">Configuration</h2>

      <form>
        <p>
          <label>
            View:&nbsp;

            <input type="radio" name="view_list"
              value="list"
              checked={this.view() === undefined}
              onChange={this.handleView.bind(this)} />
            List

            <input type="radio" name="view_collapsed"
              value="collapsed"
              checked={this.view() === 'collapsed'}
              onChange={this.handleView.bind(this)} />
            Collapsed

            <input type="radio" name="view_expanded"
              value="expanded"
              checked={this.view() === 'expanded'}
              onChange={this.handleView.bind(this)} />
            Expanded
          </label>
        </p>
        <p>
          <label>
            <a href="https://github.com/settings/tokens"
               title="needs repo or public_repo scope">
              GitHub token
            </a>:&nbsp;
            <input
              name="github-token" type="text" size="40"
              value={this.props.location.query['github-token'] || ''}
              onChange={this.handleGitHubToken.bind(this)} />
          </label>
        </p>
      </form>
    </div>
  }
}

export default Config;
