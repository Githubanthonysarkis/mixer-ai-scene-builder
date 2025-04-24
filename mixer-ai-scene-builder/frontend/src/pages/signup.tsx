import { useState } from 'react';
import styles from '../styles/Layout.module.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg('Signup successful! You can now log in.');
      } else {
        setMsg(data.error || 'Signup failed');
      }
    } catch (err) {
      setMsg('Something went wrong');
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
        <button className={styles.button} type="submit">Sign Up</button>
      </form>
      <p>{msg}</p>
    </main>
  );
}
