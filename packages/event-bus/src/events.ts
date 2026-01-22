/**
 * MFE Event Types
 *
 * These define the typed events that can be emitted across microfrontends.
 * Each event type maps to its payload structure.
 */

export interface NavigationEvent {
  path: string;
  state?: Record<string, unknown>;
}

export interface DataRefreshEvent {
  entity: string;
  id?: string | number;
}

export interface NotificationEvent {
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

export interface AuthStateChangedEvent {
  isAuthenticated: boolean;
  user?: {
    id: string;
    name: string;
    role: string;
  };
}

/**
 * MfeEvents type maps event names to their payload types
 */
export type MfeEvents = {
  "navigation:change": NavigationEvent;
  "data:refresh": DataRefreshEvent;
  "notification:show": NotificationEvent;
  "auth:state-changed": AuthStateChangedEvent;
};
