import React, { PureComponent } from 'react';
import Link from 'react-router/lib/Link';
import Bookmarklet from './Bookmarklet';
import github from './logo/github.svg';
import './Home.css';

class Home extends PureComponent {
  constructor(props) {
    super(props);
    var size;
    if (this.props.getSize) {
      size = this.props.getSize();
    } else {
      size = {width: 400, height: 400};
    }
    this.state = {
      width: size.width,
      height: size.height,
    };
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  updateDimensions() {
    var size;
    if (this.props.getSize) {
      size = this.props.getSize();
    } else {
      size = {width: 400, height: 400};
    }
    this.setState({width: size.width, height: size.height});
  }

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  render() {
    return <div className="Home"
        style={{height: this.state.height, width: this.state.width - 20}}>
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

      <h2 id="bookmarklet">Bookmarklet</h2>

      <p>
        This <Bookmarklet>depviz</Bookmarklet> bookmarklet takes you
        to the depviz view of the issue you are currently viewing.  To
        use it, copy the link into your bookmarks, and start browsing
        a host supported by the <a href="#identifiers">jump bar</a>.
        When you want to view the depviz graph for the issue you're
        viewing, click on the bookmarklet.
      </p>

      <h2 id="development">Development</h2>

      <p>
        Contributions welcome!  Fork <a
        href="https://github.com/jbenet/depviz">depviz</a> on GitHub!
      </p>
    </div>
  }
}

export default Home;
