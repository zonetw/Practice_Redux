import { createStore } from "redux";
import { Component } from "react";
import React from "react";
import ReactDOM from "react-dom";

// reducer
const counter = (state = 0, action) => {
  let result;
  switch (action.type) {
    case "INCREMENT":
      result = state + 1;
      break;
    case "DECREMENT":
      result = state - 1;
      break;
    default:
      result = state;
      break;
  }
  return result;
};
const store = createStore(counter);

const Counter = ({ value, onIncrement, onDecrement }) => {
  return (
    <div>
      <h1> {value}</h1>
      <button onClick={onIncrement}>+</button>
      <button onClick={onDecrement}>-</button>
    </div>
  );
};

const CounterPanel = () => {
  return (
    <div>
      <h1>Practice: one reducer</h1>
      <Counter
        value={store.getState()}
        onIncrement={() => {
          store.dispatch({ type: "INCREMENT" });
        }}
        onDecrement={() => {
          store.dispatch({ type: "DECREMENT" });
        }}
      />
    </div>
  );
};

const rootElement = document.getElementById("counter");
const render = () => {
  ReactDOM.render(<CounterPanel />, rootElement);
};

store.subscribe(render);
render();

export default CounterPanel;
