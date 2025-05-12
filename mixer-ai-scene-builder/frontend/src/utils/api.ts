const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 🌐 Unified API Fetch Helper
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}/${endpoint.replace(/^\/+/, '')}`; // Ensure no double slashes

  const res = await fetch(url, options);

  // 🧠 Automatically return Blob for download endpoints
  if (res.headers.get('content-type')?.includes('application/json') === false) {
    return res.blob();
  }

  // 🚨 Handle non-OK responses
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'API error occurred');
  }

  // ✅ JSON response
  return res.json();
}
