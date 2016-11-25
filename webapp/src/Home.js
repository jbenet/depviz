import React, { PureComponent } from 'react';
import github from './logo/github.svg';
import Jump from './Jump';
import './Home.css';

class Home extends PureComponent {
  render() {
    return <div className="Home">
      <Jump push={this.props.router.push} />
      <p>
        Link issues to each other with a “depends on” relationship.
        Support for issue trackers is pluggable, and depviz currently
        supports:
      </p>
      <dl>
        <dt name="github">
          <a href="https://github.com">
            <img src={github} className="Home-logo" alt="logo" />
            GitHub
          </a>
        </dt>
        <dd>
          <p>
            Place lines like <code>depends on <em>slug</em></code> in an issue
            or pull request's topic post.  <code><em>slug</em></code> can be
            any of <a
            href="https://help.github.com/articles/autolinked-references-and-urls/#issues-and-pull-requests">GitHub's
            autolinked issue/PR references</a> or a URI for an external
            resource which depviz understands.  For example:
          </p>
          <blockquote>
            depends on #2<br/>
            depends on jbenet/depviz#3
          </blockquote>
        </dd>
      </dl>
      <p>
        Contributions welcome!  Fork <a
        href="https://github.com/jbenet/depviz">depviz</a> on GitHub!
      </p>
    </div>
  }
}

export default Home;
