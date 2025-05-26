import React, { useEffect, useState } from 'react';
import TodoItem from './TodoItem';

function TodoList({ onChange }) {
  const [todos, setTodos] = useState([]);

  function getAuthToken() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; authToken=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  async function fetchTodos() {
    const token = getAuthToken();
    const res = await fetch('http://localhost:3000/todos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setTodos(data);
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onChange={onChange} />
      ))}
    </ul>
  );
}

export default TodoList;

