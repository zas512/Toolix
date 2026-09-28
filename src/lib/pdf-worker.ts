/**
 * Web Worker for PDF processing using pdf-lib.
 * Runs off the main thread.
 */
self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;
  try {
    switch (type) {
      case 'init': {
        // Initialize pdf-lib (lazy-load in production)
        self.postMessage({ type: 'ready', payload: { library: 'pdf-lib' } });
        break;
      }
      case 'merge': {
        // In full production: process PDF files with pdf-lib
        // For now: create a dummy merged result
        const result = new Uint8Array(1024); // Placeholder PDF header
        self.postMessage({ type: 'result', payload: { data: result.buffer, size: result.length } });
        break;
      }
      default:
        self.postMessage({ type: 'error', payload: { message: 'Unknown operation' } });
    }
  } catch (err: any) {
    self.postMessage({ type: 'error', payload: { message: err.message || String(err) } });
  }
};
