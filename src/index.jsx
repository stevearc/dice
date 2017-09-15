/**
 * @format
 */
"use strict";
import DiceTable from "./DiceTable";
import React from "react";
import { render } from "react-dom";

import "./css/index.css";

function randint(low, high = null) {
  if (high == null) {
    high = low;
    low = 0;
  }
  return Math.floor(Math.random() * (high + 1 - low)) + low;
}

let DIE_UID = 0;
function makeDie(value = null) {
  return {
    uid: DIE_UID++,
    value: value
  };
}

function roll(die) {
  return {
    uid: die.uid,
    value: randint(1, 6)
  };
}

class App extends React.Component {
  static defaultProps = {
    maxDice: 8,
    minDice: 1
  };

  state = {
    dice: [makeDie()],
    rollID: 0
  };

  _rollDice = () => {
    this.setState({
      dice: this.state.dice.map(die => roll(die)),
      rollID: this.state.rollID + 1
    });
  };

  _addDie = () => {
    const newVal =
      this.state.dice.length === 0 || this.state.dice[0].value == null
        ? null
        : randint(1, 6);
    this.setState({
      dice: this.state.dice.concat([makeDie(newVal)])
    });
  };

  _onRemoveDie = () => this._removeDie(this.state.dice.length - 1);

  _canRemove() {
    return this.state.dice.length > this.props.minDice;
  }

  _removeDie = idx => {
    if (!this._canRemove()) {
      return;
    }
    this.setState({
      dice: this.state.dice.slice(0, idx).concat(this.state.dice.slice(idx + 1))
    });
  };

  render() {
    return (
      <div className="container">
        <div className="controls">
          <button disabled={!this._canRemove()} onClick={this._onRemoveDie}>
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
        <DiceTable
          rollID={this.state.rollID}
          values={this.state.dice}
          canRemove={this._canRemove()}
          onRemoveDie={this._removeDie}
        />
      </div>
    );
  }
}

function startApp() {
  render(<App />, document.getElementById("react-app"));
}

window.onload = startApp;
