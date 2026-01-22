export type LoginPayload = {
  userId: string;
  password: string;
  userLocation: string;
  loginLocation: string;
};

export async function loginService(payload: LoginPayload) {
  // DEV / PROD → no API call
  if (import.meta.env.MODE !== 'test') {
    return true;
  }

  // TEST → fake API via MSW
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = await res.json();

    // API responded but failed (401, 500, etc.)
    if (!res.ok) {
      throw new Error(data.message || 'API error');
    }

    console.log('API payload ->', payload);
    console.log('API response ->', data);

    return true;
  } catch (error) {
    // Request was aborted (network hang / timeout)
    if ((error as Error).name === 'AbortError') {
      throw new Error('Network timeout');
    }

    // Any other API/network error
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

