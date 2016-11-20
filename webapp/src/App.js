import React, { Component } from 'react';
import CollapsedDepCard from './CollapsedDepCard.js';
import './App.css';

let item1 = {
  id: "jbenet/dagviz#1",
  dependencies: 0,
  dependents: 3,
  related: 2,
  isBlocked: () => false,
  isDone: () => true,
}

let item2 = {
  id: "jbenet/dagviz#2",
  dependencies: 2,
  dependents: 3,
  related: 4,
  isBlocked: () => false,
  isDone: () => false,
}

let item3 = {
  id: "jbenet/dagviz#3",
  dependencies: 2,
  dependents: 3,
  related: 4,
  isBlocked: () => true,
  isDone: () => false,
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <CollapsedDepCard item={item1} />
        <CollapsedDepCard item={item2} />
        <CollapsedDepCard item={item3} />
      </div>
    );
  }
}

export default App;
