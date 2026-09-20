type Listener = (...args: any[]) => void;

class CustomEventEmitter {
  private events: Record<string, Listener[]> = {};

  on(event: string, listener: Listener, context?: any) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(context ? listener.bind(context) : listener);
  }

  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
  }

  off(event: string, listener: Listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }
}

export const EventBus = new CustomEventEmitter();
