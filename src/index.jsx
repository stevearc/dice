/**
 * @format
 */
"use strict";
import React from "react";
import { render } from "react-dom";
import Die from "./die";

import "./css/index.css";

function randint(low, high = null) {
  if (high == null) {
    high = low;
    low = 0;
  }
  return Math.floor(Math.random() * (high + 1 - low)) + low;
}

function DiceTable({ rollID, values }) {
  return (
    <div className="dice">
      {values.map((value, idx) =>
        <Die
          key={idx}
          rollID={rollID}
          rollOffset={0.05 * (values.length - idx)}
          value={value}
        />
      )}
    </div>
  );
}

class App extends React.Component {
  static defaultProps = {
    maxDice: 8,
    minDice: 1
  };
  state = {
    dice: [null],
    rollID: 0
  };
  _rollDice = () => {
    this.setState({
      dice: this.state.dice.map(() => randint(1, 6)),
      rollID: this.state.rollID + 1
    });
  };
  _addDie = () => {
    const newVal =
      this.state.dice.length === 0 || this.state.dice[0] == null
        ? null
        : randint(1, 6);
    this.setState({
      dice: this.state.dice.concat([newVal])
    });
  };
  _removeDie = () => {
    this.setState({
      dice: this.state.dice.slice(0, -1)
    });
  };
  render() {
    return (
      <div className="container">
        <div className="controls">
          <button
            disabled={this.state.dice.length === this.props.minDice}
            onClick={this._removeDie}
          >
            -
          </button>
          <button onClick={this._rollDice}>Roll</button>
          <button
            disabled={this.state.dice.length === this.props.maxDice}
            onClick={this._addDie}
          >
            +
          </button>
        </div>
        <DiceTable rollID={this.state.rollID} values={this.state.dice} />
      </div>
    );
  }
}

function startApp() {
  render(<App />, document.getElementById("react-app"));
}

window.onload = startApp;
