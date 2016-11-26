import React, { PureComponent } from 'react';
import { Link } from 'react-router'
import github from './logo/github.svg';
import Jump from './Jump';
import './Home.css';

class Home extends PureComponent {
  render() {
    return <div className="Home">
      <Jump push={this.props.router.push} />

      <h2 id="identifiers">Identifiers</h2>

      <p>
        The jump bar above supports the following patterns:
      </p>

      <dl>
        <dt name="github-user">
          <code>
            github.com/<em>user</em>
          </code>
        </dt>
        <dd>
          <p>
            Listing all the open issues assigned to that user and
            their open dependencies.  For example,&nbsp;
            <Link to="http/github.com/jbenet">
              <code>github.com/jbenet</code>
            </Link>.
          </p>
        </dd>
        <dt name="github-repo">
          <code>
            github.com/<em>user</em>/<em>repo</em>
          </code>
        </dt>
        <dd>
          <p>
            Listing all the open issues in that repository and their
            open dependencies.  For example,&nbsp;
            <Link to="http/github.com/jbenet/depviz">
              <code>github.com/jbenet/depviz</code>
            </Link>.
          </p>
        </dd>
        <dt name="github-issue">
          <code>
            github.com/<em>user</em>/<em>repo</em>#<em>number</em>
          </code>
        </dt>
        <dt>
          <code>
            github.com/<em>user</em>/<em>repo</em>/<em>number</em>
          </code>
        </dt>
        <dt>
          <code>
            github.com/<em>user</em>/<em>repo</em>/issues/<em>number</em>
          </code>
        </dt>
        <dt>
          <code>
            github.com/<em>user</em>/<em>repo</em>/pull/<em>number</em>
          </code>
        </dt>
        <dd>
          <p>
            Listing the referenced issue and all of its open
            dependencies.  For example,&nbsp;
            <Link to="http/github.com/jbenet/depviz/1">
              <code>github.com/jbenet/depviz#1</code>
            </Link>.
          </p>
        </dd>
      </dl>

      <h2 id="dependencies">Dependencies</h2>

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

      <h2 id="development">Development</h2>

      <p>
        Contributions welcome!  Fork <a
        href="https://github.com/jbenet/depviz">depviz</a> on GitHub!
      </p>
    </div>
  }
}

export default Home;
