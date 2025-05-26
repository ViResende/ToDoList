import React from 'react';

function TodoItem({ todo, onChange }) {
  function getAuthToken() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; authToken=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  async function completeTodo() {
    const token = getAuthToken();
    await fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ completed: true })
    });
    onChange();
  }

  async function deleteTodo() {
    const token = getAuthToken();
    await fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    onChange();
  }

  async function editTodo() {
    const newTitle = prompt('New title:', todo.title);
    const newDescription = prompt('New description:', todo.description);
    const token = getAuthToken();

    await fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title: newTitle, description: newDescription })
    });

    onChange();
  }

  return (
    <li>
      {todo.title} - {todo.description} [{todo.completed ? '✅' : '❌'}]
      <button onClick={completeTodo}>Complete</button>
      <button onClick={editTodo}>Edit</button>
      <button onClick={deleteTodo}>Delete</button>
    </li>
  );
}

export default TodoItem;




