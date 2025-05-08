document.getElementById('register-btn').addEventListener('click', register);
document.getElementById('login-btn').addEventListener('click', login);
document.getElementById('add-todo-btn').addEventListener('click', addTodo);
document.getElementById('logout-btn').addEventListener('click', logout);

async function register() {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      alert('Registration successful! You can now log in.');
    } else {
      const error = await response.json();
      alert('Registration failed: ' + error.message);
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      document.cookie = `authToken=${data.token}; path=/`;
      alert('Login successful!');
      loadTodos();
    } else {
      const error = await response.json();
      alert('Login failed: ' + error.message);
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

function logout() {
  document.cookie = 'authToken=; Max-Age=0; path=/';
  alert('Logged out');
  localStorage.removeItem('todos');
  document.getElementById('todo-list').innerHTML = '';
}

async function addTodo() {
  const title = document.getElementById('todo-title').value;
  const description = document.getElementById('todo-description').value;
  const token = getAuthToken();

  try {
    const response = await fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, completed: false })
    });

    if (response.ok) {
      alert('Todo added!');
      loadTodos();
    } else {
      const error = await response.json();
      alert('Failed to add todo: ' + error.message);
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function loadTodos() {
  const token = getAuthToken();

  try {
    const response = await fetch('http://localhost:3000/todos', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const todos = await response.json();
      displayTodos(todos);
      localStorage.setItem('todos', JSON.stringify(todos));
    } else {
      alert('Failed to load todos');
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

function getAuthToken() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; authToken=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function displayTodos(todos) {
  const list = document.getElementById('todo-list');
  list.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.textContent = `${todo.title} - ${todo.description} [${todo.completed ? '✅' : '❌'}]`;

    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Complete';
    completeBtn.onclick = () => completeTodo(todo.id);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editTodo(todo.id);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTodo(todo.id);

    li.appendChild(completeBtn);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });
}

async function completeTodo(id) {
  const token = getAuthToken();

  try {
    const response = await fetch(`http://localhost:3000/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ completed: true })
    });

    if (response.ok) {
      loadTodos();
    } else {
      alert('Failed to mark complete');
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function editTodo(id) {
  const newTitle = prompt('New title:');
  const newDescription = prompt('New description:');
  const token = getAuthToken();

  try {
    const response = await fetch(`http://localhost:3000/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title: newTitle, description: newDescription })
    });

    if (response.ok) {
      loadTodos();
    } else {
      alert('Failed to edit');
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function deleteTodo(id) {
  const token = getAuthToken();

  try {
    const response = await fetch(`http://localhost:3000/todos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      loadTodos();
    } else {
      alert('Failed to delete');
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

// Restore todos from localStorage on page load
window.addEventListener('load', () => {
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
    displayTodos(JSON.parse(savedTodos));
  }
});



