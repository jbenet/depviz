import React, { PureComponent } from 'react';

class Bookmarklet extends PureComponent {
  run() {
    const depviz = 'https://jbenet.github.io/depviz/#/';
    var protocol = location.protocol.replace(/:$/, '');
    const host = location.href.split('://', 1)[0];
    if (protocol !== 'https') {
      alert(`the depviz bookmarklet does not currently support ${protocol}`);
      return;
    }
    if (location.hostname !== 'github.com') {
      alert(`the depviz bookmarklet does not currently support ${location.hostname}`);
      return;
    }
    if (protocol === 'https') {
      protocol = 'http';
    }
    const target = `${depviz}${protocol}/${location.hostname}${location.pathname}`;
    location.assign(target);
  };

  render() {
    var source = this.run.toString();
    return <a href={`javascript:(function() {\n${source}\n run();})();`}>
      {this.props.children}
    </a>
  }
}

export default Bookmarklet;

