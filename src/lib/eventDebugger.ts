import { TrackedEvent } from '../types/analytics';

const EVENT_STORAGE_KEY = 'minders_fly_events';

export const eventDebugger = {
  getEvents: (): TrackedEvent[] => {
    try {
      const stored = localStorage.getItem(EVENT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  logEvent: (event: TrackedEvent) => {
    try {
      const events = eventDebugger.getEvents();
      events.unshift(event); // Add to beginning
      // Keep only last 1000 events to prevent local storage quota issues
      const trimmedEvents = events.slice(0, 1000);
      localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(trimmedEvents));
      
      // Dispatch custom event so UI can update reactively
      window.dispatchEvent(new CustomEvent('demo_event_logged', { detail: event }));
    } catch (error) {
      console.warn('Failed to log event locally', error);
    }
  },

  clearEvents: () => {
    localStorage.removeItem(EVENT_STORAGE_KEY);
    window.dispatchEvent(new Event('demo_events_cleared'));
  }
};
