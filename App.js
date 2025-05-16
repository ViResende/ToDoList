import './style.css';
import React, { useState } from 'react';
import AuthSection from './components/AuthSection';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refresh, setRefresh] = useState(false); // to re-fetch todos after adding

  function handleLogin() {
    setIsLoggedIn(true);
  }

  function handleAddTodo() {
    setRefresh(!refresh); // trigger re-render in TodoList
  }

  return (
    <div className="container">
      <h1>Todo App</h1>
      {!isLoggedIn ? (
        <AuthSection onLoginSuccess={handleLogin} />
      ) : (
        <>
          <TodoForm onAdd={handleAddTodo} />
          <TodoList key={refresh} />
        </>
      )}
    </div>
  );
}

export default App;

