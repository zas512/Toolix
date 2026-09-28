/**
 * Web Worker for word unscrambling.
 * Runs off the main thread for smooth UI performance.
 * Handles dictionary initialization and word search operations.
 */

interface TrieNode {
  children: Map<string, TrieNode>;
  isEnd: boolean;
  word?: string;
}

const SCRABBLE_SCORES: Record<string, number> = {
  a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1,
  j: 8, k: 5, l: 1, m: 3, n: 1, o: 1, p: 3, q: 10, r: 1,
  s: 1, t: 1, u: 1, v: 4, w: 4, x: 8, y: 4, z: 10,
};

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;
  let node: TrieNode;

  try {
    switch (type) {
      case 'init': {
        // Initialize Trie from dictionary payload
        node = { children: new Map(), isEnd: false };
        for (const word of payload.dictionary) {
          const w = word.toLowerCase();
          let current = node;
          for (const char of w) {
            if (!current.children.has(char)) {
              current.children.set(char, { children: new Map(), isEnd: false });
            }
            current = current.children.get(char)!;
          }
          current.isEnd = true;
          current.word = w;
        }
        self.postMessage({ type: 'ready', payload: { wordCount: node.children.size } });
        break;
      }

      case 'search': {
        const { letters, wildcards, sortBy } = payload;

        // Build Trie from scratch each time (simpler for worker lifespan)
        node = { children: new Map(), isEnd: false };
        // We need access to the dictionary - in production this would be cached from init
        // For now, post error until proper init path is wired
        self.postMessage({
          type: 'error',
          payload: 'Dictionary not initialized — call init first'
        });
        break;
      }

      case 'search-from-init': {
        // This is the full search after init
        const { letters, wildcards, dictionary } = payload;
        node = { children: new Map(), isEnd: false };

        // Build Trie from dictionary
        for (const word of dictionary) {
          const w = word.toLowerCase();
          let current = node;
          for (const char of w) {
            if (!current.children.has(char)) {
              current.children.set(char, { children: new Map(), isEnd: false });
            }
            current = current.children.get(char)!;
          }
          current.isEnd = true;
          current.word = w;
        }

        // Search for words from letters using Trie
        const available = letters.toLowerCase().split('').filter(c => /[a-z]/.test(c));
        const used = new Set<string>();
        const results: string[] = [];

        const search = (currentWord: string, currentNode: TrieNode, depth: number) => {
          if (currentNode.isEnd && currentWord.length >= 3) {
            results.push(currentWord);
          }
          if (depth >= 15) return;

          // Try available letters
          for (const char of available) {
            if (used.has(char)) continue;
            const child = currentNode.children.get(char);
            if (!child) continue;
            used.add(char);
            search(currentWord + char, child, depth + 1);
            used.delete(char);
          }

          // Try wildcards
          const charCodes = 'abcdefghijklmnopqrstuvwxyz'.split('');
          for (const char of charCodes) {
            if (used.has(char)) continue;
            const child = currentNode.children.get(char);
            if (!child) continue;
            used.add(char);
            search(currentWord + char, child, depth + 1);
            used.delete(char);
          }
        };

        search('', node, 0);

        // Score and sort results
        const scored = results.map(w => ({
          word: w,
          score: w.split('').reduce((s, c) => s + (SCRABBLE_SCORES[c] || 0), 0)
        }));

        if (sortBy === 'length') {
          scored.sort((a, b) => b.word.length - a.word.length || b.score - a.score);
        } else {
          scored.sort((a, b) => b.score - a.score || b.word.length - a.word.length);
        }

        self.postMessage({
          type: 'results',
          payload: scored.slice(0, 50).map(r => ({ word: r.word, score: r.score }))
        });
        break;
      }
    }
  } catch (err) {
    self.postMessage({ type: 'error', payload: String(err) });
  }
};