export { queryClient } from './queryClient';
export { queryKeys } from './queryKeys';
export { http } from './http';
export { getRentedVehicles } from './bff';
export {
  handleQueryError,
  useQueryErrorHandler,
  emitErrorNotification,
  emitSuccessNotification,
  emitInfoNotification,
  emitWarningNotification,
  type ErrorResponse,
  type QueryErrorContext,
} from './errorHandler';
