/**
 * @format
 */
"use strict";
import React from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";

import "./css/die.css";
import "./css/animation.css";

// prettier-ignore
const FACE_MAP = [
  null,
  [0, 0, 0, // 1
   0, 1, 0,
   0, 0, 0],
  [1, 0, 0, // 2
   0, 0, 0,
   0, 0, 1],
  [1, 0, 0, // 3
   0, 1, 0,
   0, 0, 1],
  [1, 0, 1, // 4
   0, 0, 0,
   1, 0, 1],
  [1, 0, 1, // 5
   0, 1, 0,
   1, 0, 1],
  [1, 0, 1, // 6
   1, 0, 1,
   1, 0, 1],
]
const FACE_TRANSFORM = [
  null,
  "rotateX(0deg) rotateY(0deg) rotateZ(0deg)",
  "rotateX(-90deg) rotateY(0deg) rotateZ(0deg)",
  "rotateX(0deg) rotateY(-90deg) rotateZ(0deg)",
  "rotateX(0deg) rotateY(90deg) rotateZ(0deg)",
  "rotateX(90deg) rotateY(0deg) rotateZ(0deg)",
  "rotateX(180deg) rotateY(0deg) rotateZ(0deg)"
];

function Face({ className, pips }) {
  return (
    <div className={classnames("side", className)}>
      {FACE_MAP[pips].map((visible, idx) =>
        <div key={idx} className={classnames("dot", { hidden: !visible })} />
      )}
    </div>
  );
}

export default class Die extends React.Component {
  _demoOffset = -4 * Math.random();
  static defaultProps = {
    rollOffset: 0
  };
  state = {
    rolling: false
  };
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.value == null || this.state.rolling || nextState.rolling;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value != null && this.props.rollID !== nextProps.rollID) {
      this.setState({ rolling: true });
    }
  }
  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    el.addEventListener("animationend", this._onAnimationEnd);
    this._animationOffset = -1 * Math.random();
  }
  componentWillUnmount() {
    const el = ReactDOM.findDOMNode(this);
    el.removeEventListener("animationend", this._onAnimationEnd);
  }
  _onAnimationEnd = () => {
    this.setState({ rolling: false });
  };
  render() {
    const style = {
      animation: this.state.rolling
        ? `roll 1s linear -${this.props.rollOffset}s`
        : this.props.value == null
          ? `demo 5s linear ${this._demoOffset}s infinite`
          : null,
      transform: this.state.rolling ? null : FACE_TRANSFORM[this.props.value]
    };
    return (
      <div className="die" style={style}>
        {Array(6).fill().map((_, idx) => <Face key={idx} pips={1 + idx} />)}
      </div>
    );
  }
}
