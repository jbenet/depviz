import React, { PureComponent } from 'react';
import './Config.css';

class Config extends PureComponent {
  expanded() {
    return (
      this.props.location &&
      this.props.location.query.expanded === 'true'
    );
  }

  handleExpanded(event) {
    var query = Object.assign({}, this.props.location.query);
    if (event.target.checked) {
      query.expanded = 'true';
    } else {
      delete query.expanded;
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
            Expanded cards:&nbsp;
            <input
              name="expanded" type="checkbox"
              checked={this.expanded()}
              onChange={this.handleExpanded.bind(this)} />
          </label>
        </p>
      </form>
    </div>
  }
}

export default Config;
