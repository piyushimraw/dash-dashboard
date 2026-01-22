export type LoginPayload = {
  userId: string;
  password: string;
  userLocation: string;
  loginLocation: string;
};

export async function loginService(data: LoginPayload): Promise<true> {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    // console.log('ErrorInloginService', res)
    if (!res.ok) {
        if (res.status === 401) throw new Error('INVALID_CREDENTIALS');
        throw new Error('API_ERROR');
      }
      return true;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('NETWORK_ERROR');
      }
      throw error;
    }
}