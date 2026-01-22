import { setupServer } from 'msw/node';
import { handlers } from './handlers';
import { selectHandlers } from './selectHandlers';

export const server = setupServer(...handlers, ...selectHandlers);
