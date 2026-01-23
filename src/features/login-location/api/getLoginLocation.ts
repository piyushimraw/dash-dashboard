import type { LoginLocationDataType } from '../types';

export async function getLoginLocations(): Promise<LoginLocationDataType[]> {
  const res = await fetch(
    'https://dummyjson.com/c/4fa3-3817-4472-b407'
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'API_ERROR');
    // throw new Error('API_ERROR');
  }

  return res.json();
}
