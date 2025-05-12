import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Layout.module.css';
import { apiFetch } from '../utils/api';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'verifying'|'success'|'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email…');

  useEffect(() => {
    const token = router.query.token as string;
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    // 🔄  Call backend via apiFetch
    apiFetch(`verify-email?token=${token}`)
      .then((data) => {
        setStatus('success');
        setMessage(data.message || 'Email verified! Redirecting…');
        setTimeout(() => router.push('/login'), 4000);
      })
      .catch((err: any) => {
        setStatus('error');
        setMessage(err.message || 'Verification failed.');
      });
  }, [router.query.token]);

  return (
    <main className={styles.page}>
      <h1>Email Verification</h1>
      <p>{message}</p>
      {status === 'verifying' && <p>🔄 Verifying…</p>}
      {status === 'success'   && <p>✅ Verified!</p>}
      {status === 'error'     && <p>❌ Error.</p>}
    </main>
  );
}
