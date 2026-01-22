import mitt, { type Emitter } from "mitt";
import type { MfeEvents } from "./events";

/**
 * Typed event bus for cross-MFE communication
 *
 * Usage:
 *   // Emit an event
 *   eventBus.emit("notification:show", { type: "success", message: "Saved!" });
 *
 *   // Subscribe to an event
 *   eventBus.on("notification:show", (event) => {
 *     console.log(event.message);
 *   });
 *
 *   // Unsubscribe
 *   eventBus.off("notification:show", handler);
 */
export const eventBus: Emitter<MfeEvents> = mitt<MfeEvents>();
