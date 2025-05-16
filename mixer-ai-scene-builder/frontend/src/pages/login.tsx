import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Layout.module.css';
import { apiFetch } from '@/utils/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // apiFetch already returns JSON or throws
      const data = await apiFetch('auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      setMsg('Login successful!');
      router.push('/dashboard');
    } catch (err: any) {
      setMsg(err.message || 'Login failed');
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
        <button className={styles.button} type="submit">
          Log In
        </button>
      </form>

      <button
        className={styles.button}
        onClick={() => {
          //  Initiates the OAuth handshake
          window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
        }}
      >
        Log In with Google
      </button>

      <p>{msg}</p>
    </main>
  );
}
