import React from "react";
import { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Provider } from "react-redux";
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
    case "TOGGLE_TODO":
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
    case "TOGGLE_TODO":
      return state.map(el => {
        return todo(el, action);
      });
      break;
    default:
      return state;
      break;
  }
};

const visibilityFilter = (state = "SHOW_ALL", action) => {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return state;
      break;
  }
};

const Link = ({ active, children, onClick }) => {
  if (active) {
    return <span>{children}</span>;
  } else {
    return (
      <a
        href="#"
        onClick={e => {
          e.preventDefault();
          onClick();
        }}
      >
        {children}
      </a>
    );
  }
};

// class FilterLink extends Component {
//   componentDidMount() {
//     const { store } = this.context;
//     this.unsubscribe = store.subscribe(() => this.forceUpdate());
//   }

//   componentWillUnmount() {
//     this.unsubscribe();
//   }

//   render() {
//     const props = this.props;
//     const { store } = this.context;
//     const state = store.getState();

//     return (
//       <Link
//         active={props.filter === state.visibilityFilter}
//         onClick={() => {
//           store.dispatch({
//             type: "SET_VISIBILITY_FILTER",
//             filter: props.filter
//           });
//         }}
//       >
//         {props.children}
//       </Link>
//     );
//   }
// }
// FilterLink.contextTypes = {
//   store: React.PropTypes
// };

const mapStateToLinkProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
};

const setVisibilityFilter = filter => {
  return {
    type: "SET_VISIBILITY_FILTER",
    filter
  };
};

const mapDispatchToLinkProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter));
    }
  };
};

const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link);

const getFilterdTodos = (todos, filter) => {
  switch (filter) {
    case "SHOW_ALL":
      return todos;
    case "SHOW_COMPLETED":
      return todos.filter(todo => {
        return todo.completed;
      });
    case "SHOW_ACTIVE":
      return todos.filter(todo => {
        return !todo.completed;
      });
  }
};

// reducer
const todoApp = combineReducers({
  todos,
  visibilityFilter
});

const Todo = ({ onClick, text, completed }) => {
  return (
    <li
      key={todo.id}
      onClick={onClick}
      style={{
        textDecoration: completed ? "line-through" : "none"
      }}
    >
      {text}
    </li>
  );
};

const TodoList = ({ todos, onTodoClick }) => (
  <div>
    <ul>
      {todos.map(todo => (
        <Todo
          key={todo.id}
          {...todo}
          onClick={() => {
            onTodoClick(todo.id);
          }}
        />
      ))}
    </ul>
  </div>
);

let nextTodoId = 0;

// action creator
const addTodo = text => {
  return {
    type: "ADD_TODO",
    id: nextTodoId++,
    text
  };
};

let AddTodo = ({ dispatch }) => {
  let input;
  return (
    <div>
      <input
        ref={node => {
          input = node;
        }}
      />
      <button
        onClick={() => {
          dispatch(addTodo(input.value));
          input.value = "";
        }}
      >
        Add Todo
      </button>
    </div>
  );
};
AddTodo = connect()(AddTodo);

const Footer = (props, { store }) => {
  return (
    <p>
      Show:{" "}
      <FilterLink filter="SHOW_ALL" store={store}>
        ALL
      </FilterLink>{" "}
      <FilterLink filter="SHOW_ACTIVE" store={store}>
        Active
      </FilterLink>{" "}
      <FilterLink filter="SHOW_COMPLETED" store={store}>
        Completed
      </FilterLink>
    </p>
  );
};
Footer.contextTypes = {
  store: React.PropTypes
};

// class VisibleTodoList extends Component {
//   componentDidMount() {
//     const { store } = this.context;
//     this.unsubscribe = store.subscribe(() => this.forceUpdate());
//   }

//   componentWillUnmount() {
//     this.unsubscribe();
//   }

//   render() {
//     const { store } = this.context;
//     const state = store.getState();

//     return (
//       <TodoList
//         todos={getFilterdTodos(state.todos, state.visibilityFilter)}
//         onTodoClick={id =>
//           store.dispatch({
//             type: "TOGGLE_TODO",
//             id
//           })
//         }
//       />
//     );
//   }
// }
// VisibleTodoList.contextTypes = {
//   store: React.PropTypes
// };

const mapStateToProps = state => {
  return {
    todos: getFilterdTodos(state.todos, state.visibilityFilter)
  };
};

const toggleTodo = id => {
  return {
    type: "TOGGLE_TODO",
    id
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTodoClick: id => {
      dispatch(toggleTodo(id));
    }
  };
};

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);

const TodoApp = () => {
  return (
    <div>
      <h1>Practice: reducer with compisition pattern</h1>
      <AddTodo />
      <Footer />
      <VisibleTodoList />
    </div>
  );
};

const rootElement = document.getElementById("todo");
ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  rootElement
);
export default TodoApp;
