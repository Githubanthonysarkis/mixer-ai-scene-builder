import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Layout.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setMsg('Login successful!');
        router.push('/dashboard');
      } else {
        setMsg(data.error || 'Login failed');
      }
    } catch (err) {
      setMsg('Something went wrong');
    }
  };

  return (
    <main className={styles.page}>
      <h1>Login</h1>
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
        <button className={styles.button} type="submit">Log In</button>
      </form>
      <p>{msg}</p>
    </main>
  );
}
