import styles from '../styles/Layout.module.css';
import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('/api/')
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => setMessage('Error contacting backend'));
  }, []);

  return (
    <main className={styles.page}>
      <h1>Dashboard</h1>
      <p>Welcome to your scene builder dashboard!</p>
    </main>
  );
}
