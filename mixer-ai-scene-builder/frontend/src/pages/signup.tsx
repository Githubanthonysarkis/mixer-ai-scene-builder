import { useState } from 'react';
import styles from '../styles/Layout.module.css';
import { apiFetch } from '../utils/api';

export default function Signup() {
  // 🔧 Local form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  // 🔐 Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      /**
       * apiFetch:
       *  1. Builds full URL using NEXT_PUBLIC_API_BASE_URL
       *  2. Throws if response.status >= 400
       *  3. Parses JSON and returns it
       */
      const data = await apiFetch('auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // If we reach here → request was OK (201) and data is already JSON
      setMsg(data.message || 'Signup successful! Check your email.');
    } catch (err: any) {
      // err.message comes from apiFetch (backend error text)
      setMsg(err.message || 'Signup failed');
    }
  };

  return (
    <main className={styles.page}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.button} type="submit">
          Sign Up
        </button>
      </form>
      <p>{msg}</p>
    </main>
  );
}
