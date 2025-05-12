import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Layout.module.css';
import { apiFetch } from '../utils/api';

export default function Dashboard() {
  const router = useRouter();

  // Holds logged-in user details (email only for now)
  const [user, setUser] = useState<{ email?: string } | null>(null);

  // Loading and error control
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Scene history state (fetched from backend)
  const [scenes, setScenes] = useState([]);

  // 🔐 Check token and get user info on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirect if not authenticated
      return;
    }

    // 🔄 Validate token and fetch user info
    apiFetch('user/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => {
        setUser(data.user); // 👤 Set the user state
        setLoading(false);
      })
      .catch((err) => {
        // ❌ Invalid/expired token handling
        localStorage.removeItem('token');
        router.push('/login');
        setError('Your session has expired or is invalid. Please log in again.');
        setLoading(false);
      });
  }, []);

  // 🎛 Fetch user’s previously saved scenes
  useEffect(() => {
    const fetchUserScenes = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const data = await apiFetch('scene/user-scenes', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setScenes(data.scenes); // 🎉 Store scene data into state
      } catch (err) {
        console.error('Error Fetching Scenes:', err);
      }
    };

    fetchUserScenes();
  }, []);

  // ⏳ Loading fallback
  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <main className={styles.page}>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email} 👋</p>

      {/* 🔓 Logout */}
      <button
        className={styles.button}
        onClick={() => {
          localStorage.removeItem('token');
          router.push('/login');
        }}
      >
        Log Out
      </button>

      {/* 📜 Scene List */}
      <h2>Saved Scenes</h2>
      {scenes.length === 0 ? (
        <p>No scenes found.</p>
      ) : (
        <ul>
          {scenes.map((scene: any) => (
            <li key={scene._id}>
              <strong>{scene.sceneName}</strong> — {scene.mixer} ({scene.brand})<br />
              <small>Created: {new Date(scene.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
