import { LOCATION_OPTIONS } from '@/forms/login/login.schema';
import { http, HttpResponse } from 'msw';

export const selectHandlers = [
  http.get('/api/locations', () => {
    return HttpResponse.json(LOCATION_OPTIONS);
  }),
];
