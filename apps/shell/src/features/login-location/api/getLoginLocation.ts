import { LoginLocationDataType } from "../types";

export const LOGIN_LOCATION_LIST_API = 'https://dummyjson.com/c/4fa3-3817-4472-b407'

export async function getLoginLocations(): Promise<LoginLocationDataType[]> {
  const res = await fetch(LOGIN_LOCATION_LIST_API);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'API_ERROR');
  }

  return res.json();
}