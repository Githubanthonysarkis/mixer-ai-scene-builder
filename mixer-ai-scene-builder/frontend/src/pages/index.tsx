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
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Mixer AI Scene Builder</h1>
      <p>Backend says: {message}</p>
    </main>
  );
}
