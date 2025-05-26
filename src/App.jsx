import './style.css';
import React, { useState } from 'react';
import AuthSection from './components/AuthSection';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refresh, setRefresh] = useState(false);

  function handleLogin() {
    setIsLoggedIn(true);
  }

  function handleLogout() {
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setIsLoggedIn(false);
  }

  function handleAddTodo() {
    setRefresh(!refresh);
  }

  return (
    <div className="container">
      <h2>Todo App</h2>
      {!isLoggedIn ? (
        <AuthSection onLoginSuccess={handleLogin} />
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>
          <TodoForm onAdd={handleAddTodo} />
          <TodoList key={refresh} onChange={handleAddTodo} />
        </>
      )}
    </div>
  );
}

export default App;

