import React, { useState } from 'react';

export default function LoginForm() {
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      localStorage.setItem('user', username);
      window.location.href = '/admin';
    } else {
      setError('Invalid credentials!');
    }
  }

  return (
    <div className="bg-gray-200 text-gray-900 selection:bg-yellow-300 sm:text-lg min-h-screen flex justify-center items-end sm:items-center p-2 sm:p-8">
      <div className="relative max-w-md w-full">
        <img
          src="/loginForm.png"
          alt="Security Image"
          className="absolute top-0 right-0 w-24 h-auto -translate-y-full"
        />
        <form
          onSubmit={handleSubmit}
          className="relative bg-slate-50 rounded shadow-lg p-8 space-y-4"
        >
          <h1 className="text-xl">Log in</h1>
          <input
            name="username"
            placeholder="Username"
            required
            className="w-full p-2 border border-slate-300 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full p-2 border border-slate-300 rounded"
          />
          {error && <p className="text-red-600 uppercase">{error}</p>}
          <div className="flex justify-end gap-4">
            <a
              href="/"
              className="text-center bg-yellow-400 hover:bg-yellow-500 text-slate-950 transition px-4 py-2 rounded w-full sm:w-fit"
            >
              🏠 Go to Home
            </a>
            <button
              type="submit"
              className="bg-zinc-950 hover:bg-yellow-400 text-zinc-50 hover:text-slate-950 transition px-4 py-2 rounded w-full sm:w-fit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
