import { http, HttpResponse } from 'msw';

type LoginRequestBody = {
  userId: string;
  password: string;
};

export const handlers = [
  http.post('/api/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequestBody;

    if (body.userId === 'admin' && body.password === 'admin123') {
      return HttpResponse.json(
        { token: 'fake-token' },
        { status: 200 }
      );
    }

    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  }),
];
