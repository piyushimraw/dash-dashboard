import { http, HttpResponse } from 'msw';

import { LOCATION_OPTIONS } from '@/forms/login/login.schema';

export const selectHandlers = [
  http.get('/api/locations', () => {
    return HttpResponse.json(LOCATION_OPTIONS);
  }),
];
