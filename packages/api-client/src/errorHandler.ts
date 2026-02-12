import { eventBus, MfeEventNames } from '@packages/event-bus';

export interface ErrorResponse {
  status?: number;
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export interface QueryErrorContext {
  isRetryable: boolean;
  httpStatus?: number;
  userMessage: string;
  originalError: unknown;
}

function isRetriableError(status?: number): boolean {
  if (!status) return false;
  return status === 408 || status === 429 || (status >= 500 && status < 600);
}

function getHttpStatus(error: unknown): number | undefined {
  if (error && typeof error === 'object') {
    if ('status' in error) return error.status as number;
    if ('statusCode' in error) return error.statusCode as number;
    if ('response' in error && error.response && typeof error.response === 'object') {
      if ('status' in error.response) return error.response.status as number;
    }
  }
  return undefined;
}

function getErrorMessage(status?: number, error?: unknown): string {
  if (!status) {
    // Handle network errors
    if (error && typeof error === 'object') {
      if ('message' in error) {
        const message = error.message as string;
        if (message.includes('fetch') || message.includes('network')) {
          return 'Network error. Please check your connection.';
        }
      }
    }
    return 'An unexpected error occurred. Please try again.';
  }

  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Session expired. Please log in again.';
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return 'The requested resource was not found.';
    case 408:
      return 'Request timeout. Please try again.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      if (status >= 500) {
        return 'Something went wrong. Please try again.';
      }
      return 'An error occurred. Please try again.';
  }
}

function extractErrorContext(error: unknown): QueryErrorContext {
  const httpStatus = getHttpStatus(error);
  const isRetryable = isRetriableError(httpStatus);
  const userMessage = getErrorMessage(httpStatus, error);

  return {
    isRetryable,
    httpStatus,
    userMessage,
    originalError: error,
  };
}

export function handleQueryError(error: unknown): void {
  const context = extractErrorContext(error);

  // Emit notification event through event bus
  eventBus.emit(MfeEventNames.NotificationShow, {
    type: 'error',
    message: context.userMessage,
    duration: context.isRetryable ? 5000 : 4000, // Slightly longer for retriable errors
  });

  // Log original error for debugging purposes
  // if (typeof globalThis !== 'undefined' && (globalThis as any).__DEBUG__) {
  //   console.error('[React Query Error]', {
  //     userMessage: context.userMessage,
  //     httpStatus: context.httpStatus,
  //     isRetryable: context.isRetryable,
  //     originalError: context.originalError,
  //   });
  // }
}

export function useQueryErrorHandler() {
  return handleQueryError;
}

export function emitErrorNotification(
  httpStatus?: number,
  customMessage?: string,
  isRetryable?: boolean,
): void {
  const message = customMessage || getErrorMessage(httpStatus);

  eventBus.emit(MfeEventNames.NotificationShow, {
    type: 'error',
    message,
    duration: isRetryable ? 5000 : 4000,
  });
}

/**
 * Success notification helper
 */
export function emitSuccessNotification(message: string, duration = 4000): void {
  eventBus.emit(MfeEventNames.NotificationShow, {
    type: 'success',
    message,
    duration,
  });
}

/**
 * Info notification helper
 */
export function emitInfoNotification(message: string, duration = 4000): void {
  eventBus.emit(MfeEventNames.NotificationShow, {
    type: 'info',
    message,
    duration,
  });
}

/**
 * Warning notification helper
 */
export function emitWarningNotification(message: string, duration = 4000): void {
  eventBus.emit(MfeEventNames.NotificationShow, {
    type: 'warning',
    message,
    duration,
  });
}
