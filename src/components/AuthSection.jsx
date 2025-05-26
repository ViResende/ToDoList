import React, { useState } from 'react';

function AuthSection({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    const url = isRegistering
      ? 'http://localhost:3000/register'
      : 'http://localhost:3000/login';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        document.cookie = `authToken=${data.token}; path=/`;
        onLoginSuccess();
      } else {
        alert(data.error || 'Authentication failed.');
      }
    } catch {
      alert('Network error. Try again.');
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3>{isRegistering ? 'Register' : 'Login'}</h3>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>

      {!isRegistering ? (
        <p>
          Don’t have an account?{' '}
          <button type="button" onClick={() => setIsRegistering(true)}>
            Click here to register
          </button>
        </p>
      ) : (
        <p>
          Already have an account?{' '}
          <button type="button" onClick={() => setIsRegistering(false)}>
            Click here to login
          </button>
        </p>
      )}
    </>
  );
}

export default AuthSection;




