/**
 * @format
 */
"use strict";
import Die from "./Die";
import Draggable from "react-draggable";
import React from "react";

class Throwable extends React.Component {
  state = {
    opacity: 1,
    dragging: false,
    throwPos: null,
    throwTime: 0
  };

  _onDragStart = () => {
    if (!this.props.canRemove) {
      return;
    }
    this._startTime = Date.now();
    this.setState({ dragging: true });
  };

  _onDragStop = (e, data) => {
    if (!this.props.canRemove) {
      return;
    }
    const duration = Date.now() - this._startTime;
    const distance = Math.sqrt(data.x * data.x + data.y * data.y);
    const velocity = distance / duration;
    if (velocity >= 1.3) {
      const throwPos = {
        x: data.x * 4 * velocity,
        y: data.y * 4 * velocity
      };
      this.setState({
        opacity: 1,
        dragging: false,
        throwPos,
        throwTime: duration * 4 / 1000
      });
      data.node.addEventListener("transitionend", this._onTransitionEnd);
      this._cleanup = () =>
        data.node.removeEventListener("transitionend", this._onTransitionEnd);
    } else {
      this.setState({ opacity: 1, dragging: false });
    }
  };

  _onDrag = (e, data) => {
    if (!this.props.canRemove) {
      return;
    }
    const distance = Math.sqrt(data.x * data.x + data.y * data.y);
    const opacity = Math.max(0.1, 1 - distance / 900);
    this.setState({ opacity });
  };

  _onTransitionEnd = () => {
    if (!!this.state.throwPos) {
      this.props.onThrow();
    }
  };

  componentWillUnmount() {
    if (this._cleanup) {
      this._cleanup();
    }
  }

  render() {
    const style = {
      opacity: this.state.opacity
    };
    if (this.state.throwPos) {
      style.transition = `transform ${this.state.throwTime}s linear`;
    }
    return (
      <Draggable
        position={
          this.state.throwPos != null ? this.state.throwPos : { x: 0, y: 0 }
        }
        disabled={!!this.state.throwPos}
        onStart={this._onDragStart}
        onStop={this._onDragStop}
        onDrag={this._onDrag}
      >
        {React.cloneElement(React.Children.only(this.props.children), {
          style
        })}
      </Draggable>
    );
  }
}

export default function DiceTable({ rollID, values, canRemove, onRemoveDie }) {
  return (
    <div className="dice">
      {values.map((die, idx) =>
        <Throwable
          key={die.uid}
          onThrow={onRemoveDie.bind(undefined, idx)}
          canRemove={canRemove}
        >
          <div>
            <Die
              rollID={rollID}
              rollOffset={0.05 * (values.length - idx)}
              value={die.value}
            />
          </div>
        </Throwable>
      )}
    </div>
  );
}
