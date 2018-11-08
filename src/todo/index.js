import React from "react";
import { Component } from "react";
import ReactDOM from "react-dom";

import { createStore } from "redux";
import { combineReducers } from "redux";

// reducer
const todo = (state = {}, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case "TOOGLE_TODO":
      if (state.id === action.id) {
        return {
          ...state,
          completed: !state.completed
        };
      } else {
        return state;
      }
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, todo(undefined, action)];
    case "TOOGLE_TODO":
      return state.map(el => {
        return todo(el, action);
      });
      break;
    default:
      return state;
      break;
  }
};

const toogleVisibility = (state = "SHOW_ALL", action) => {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return state;
      break;
  }
};

// reducer
const todoApp = combineReducers({
  todos,
  toogleVisibility
});

const store = createStore(todoApp);

let todoId = 0;

class Todo extends Component {
  render() {
    return (
      <div>
        <h1>Practice: reducer with compisition pattern</h1>
        <input
          ref={node => {
            this.input = node;
          }}
        />
        <button
          onClick={() => {
            store.dispatch({
              type: "ADD_TODO",
              text: this.input.value,
              id: todoId++
            });

            this.input.value = "";
          }}
        >
          Add Todo
        </button>
        <div>current maxId: {todoId}</div>
        <ul>
          {this.props.todos.map(todo => {
            return (
              <li
                key={todo.id}
                onClick={() => {
                  store.dispatch({
                    type: "TOOGLE_TODO",
                    id: todo.id
                  });
                }}
                style={{
                  textDecoration: todo.completed ? "line-through" : "none"
                }}
              >
                {todo.text}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

const rootElement = document.getElementById("todo");
const render = () => {
  ReactDOM.render(<Todo todos={store.getState().todos} />, rootElement);
};
store.subscribe(render);
render();
export default Todo;
