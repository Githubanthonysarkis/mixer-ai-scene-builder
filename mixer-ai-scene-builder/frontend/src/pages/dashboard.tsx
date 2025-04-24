import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Layout.module.css';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // 🚫 No token = definitely not logged in
      router.push('/login');
      return;
    }

    // ✅ Ask the backend to validate the token
    fetch('/api/user/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          // 🧠 Detect if it's a 401 error (unauthorized)
          if (res.status === 401) {
            // 🚫 Token is invalid or expired → clean it up
            localStorage.removeItem('token');
            router.push('/login'); // Redirect to login
          }
          throw new Error(data.error || 'Unauthorized access');
        }

        // ✅ Token is valid → display user info
        setUser(data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Dashboard error:', err.message);
        setError('Your session has expired or is invalid. Please log in again.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <main className={styles.page}>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email} 👋</p>
    </main>
  );
}


