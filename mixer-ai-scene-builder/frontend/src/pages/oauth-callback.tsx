import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function OAuthCallback() {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (typeof token === 'string') {
      // 1️⃣ Store the JWT
      localStorage.setItem('token', token);
      // 2️⃣ Redirect to the dashboard or wherever
      router.replace('/dashboard');
    }
  }, [token, router]);

  return <p>Logging you in… please wait.</p>;
}
