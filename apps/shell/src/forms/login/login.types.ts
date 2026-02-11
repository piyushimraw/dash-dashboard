import type { z } from 'zod';

import type { loginSchema } from './login.schema';

export type LoginFormValues = z.infer<typeof loginSchema>;
