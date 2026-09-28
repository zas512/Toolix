/**
 * Unthrottled Web Worker tick thread for Pomodoro timer.
 * Runs independently of tab visibility.
 */

let interval: number | null = null;
let secondsLeft = 1500; // 25 minutes default

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;
  switch (type) {
    case 'start': {
      secondsLeft = payload.duration || 1500;
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        secondsLeft--;
        self.postMessage({ type: 'tick', payload: { secondsLeft } });
        if (secondsLeft <= 0) {
          clearInterval(interval!);
          interval = null;
          self.postMessage({ type: 'tick', payload: { secondsLeft: 0 } });
        }
      }, 1000);
      break;
    }
    case 'pause': {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      break;
    }
    case 'reset': {
      if (interval) clearInterval(interval);
      interval = null;
      secondsLeft = 1500;
      break;
    }
  }
};
