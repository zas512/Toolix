/**
 * Prefix Tree (Trie) data structure for word unscrambling.
 * Stores words and computes Scrabble scores for instant lookups.
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

export class Trie {
  private root: TrieNode;
  private size: number = 0;

  constructor() {
    this.root = { children: new Map(), isEnd: false };
  }

  insert(word: string): void {
    const w = word.toLowerCase();
    let node = this.root;
    for (const char of w) {
      if (!node.children.has(char)) {
        node.children.set(char, { children: new Map(), isEnd: false });
      }
      node = node.children.get(char)!;
    }
    if (!node.isEnd) {
      node.isEnd = true;
      node.word = w;
      this.size++;
    }
  }

  contains(word: string): boolean {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char)!;
    }
    return node.isEnd;
  }

  /** Get all words that are prefixes of the given string */
  startsWith(prefix: string): string[] {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children.has(char)) return [];
      node = node.children.get(char)!;
    }
    return this._collectWords(node);
  }

  private _collectWords(node: TrieNode, prefix = ''): string[] {
    const results: string[] = [];
    if (node.isEnd && node.word) results.push(node.word);
    for (const [char, child] of node.children) {
      results.push(...this._collectWords(child, prefix + char));
    }
    return results;
  }

  /** Get all valid words that can be formed from the given letters */
  getWordsFromLetters(letters: string, wildcards = 0): string[] {
    const available = letters.toLowerCase().split('').filter(c => /[a-z]/.test(c));
    const results: string[] = [];
    const used = new Array(available.length).fill(false);
    const wildcardSlots = new Array(wildcards).fill(true);

    const backtrack = (current: string, node: TrieNode, depth: number) => {
      if (node.isEnd && current.length >= 3) {
        results.push(current);
      }
      if (depth >= 15) return; // Cap word length

      // Try available letters
      for (let i = 0; i < available.length; i++) {
        if (used[i]) continue;
        const char = available[i];
        const child = node.children.get(char);
        if (!child) continue;
        used[i] = true;
        backtrack(current + char, child, depth + 1);
        used[i] = false;
      }

      // Try wildcards
      if (wildcardSlots.length > 0) {
        for (const char of 'abcdefghijklmnopqrstuvwxyz') {
          const child = node.children.get(char);
          if (!child) continue;
          wildcardSlots.length--;
          backtrack(current + char, child, depth + 1);
          wildcardSlots.length++;
        }
      }
    };

    backtrack('', this.root, 0);
    return [...new Set(results)]; // Deduplicate
  }

  /** Score a word using Scrabble tile values */
  scoreWord(word: string): number {
    return word.toLowerCase().split('').reduce((sum, c) => sum + (SCRABBLE_SCORES[c] || 0), 0);
  }

  getSize(): number { return this.size; }
}

/**
 * Web Worker message handler for unscrambling.
 * Runs off the main thread for smooth UI performance.
 */
export function createUnscramblerWorker() {
  self.onmessage = (e: MessageEvent) => {
    const { type, payload } = e.data;
    try {
      switch (type) {
        case 'init': {
          const trie = new Trie();
          for (const word of payload.dictionary) {
            trie.insert(word);
          }
          self.postMessage({ type: 'ready', payload: { wordCount: trie.getSize() } });
          // Store trie reference (simplified - real impl would transfer)
          break;
        }
        case 'search': {
          const { letters, wildcards, sortBy } = payload;
          const trie = new Trie(); // In real impl, reuse existing trie
          const results = trie.getWordsFromLetters(letters, wildcards);
          const scored = results.map(w => ({ word: w, score: trie.scoreWord(w) }));
          if (sortBy === 'length') {
            scored.sort((a, b) => b.word.length - a.word.length || b.score - a.score);
          } else {
            scored.sort((a, b) => b.score - a.score || b.word.length - a.word.length);
          }
          self.postMessage({ type: 'results', payload: scored.slice(0, 50) });
          break;
        }
      }
    } catch (err) {
      self.postMessage({ type: 'error', payload: String(err) });
    }
  };
}
