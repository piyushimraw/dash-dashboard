import { setupServer } from 'msw/node';
import { handlers } from './handlers/handlers';
import { selectHandlers } from './handlers/selectHandlers';

export const server = setupServer(...handlers, ...selectHandlers);