import React, { Component } from 'react';
import DepIndicator from './DepIndicator';
import './CollapsedDepCard.css';

class CollapsedDepCard extends Component {
  numDependencies() { return 10 }
  numRelated() { return 5 }
  numDependents() { return 50 }

  render() {
    let item = this.props.item
    let di1 = <DepIndicator count={item.dependencies} state={DepStateReady(item)} />
    let di2 = <DepIndicator count={item.related} />
    let di3 = <DepIndicator count={item.dependents} state={DepStateDone(item)} />
    console.log(item.progress.percent())
    return (
      <div className={"CollapsedDepCard DepState-" + DepStateDone(item)}>
        <div className="CollapsedDepCard-text">
          <span>{item.id}</span>
        </div>
        <div className="CollapsedDepCard-indicators">
          {di1}
          {di2}
          {di3}
        </div>
        <div className="CardProgressBar" style={{width: item.progress.percent() +"%"}}>
        </div>
      </div>
    );
  }
}

function DepStateReady(item) {
  return item.isBlocked() ? 1 : 2
}

function DepStateDone(item) {
  return item.isDone() ? 2 : 1
}

export default CollapsedDepCard;
