import { http, HttpResponse } from 'msw';
import { rentedVehiclesMock } from '../shared-mocks/rentedVehicles.mock';
import { LOCATION_OPTIONS } from '@/forms/login/login.schema';

type LoginRequestBody = {
  userId: string;
  password: string;
};

export const handlers = [
  http.post('/api/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequestBody;

    if (body.userId === 'admin' && body.password === 'admin123') {
      return HttpResponse.json({ token: 'fake-token' }, { status: 200 });
    }

    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),
  // Mock the external dummyjson endpoint used by getRentedVehicleList in tests
  http.get('https://dummyjson.com/c/1394-326c-4220-88d7', () =>
    HttpResponse.json(rentedVehiclesMock),
  ),
  // Mock the external dummyjson endpoint used by getLoginLocations
  http.get('https://dummyjson.com/c/4fa3-3817-4472-b407', () =>
    HttpResponse.json(LOCATION_OPTIONS),
  ),
];
