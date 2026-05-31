// 🍩 Donut Corp — Engine Bridge
// Delegates all inference to @uncharted-ai/donut-runtime
// Drop-in replacement for the old node-llama-cpp wrapper

import { DonutEngine } from '@uncharted-ai/donut-runtime';

export class LlamaCpp {
  constructor() {
    this.engine = new DonutEngine();
  }

  async load(modelPath, opts = {}) {
    await this.engine.load(modelPath, {
      ctx:      opts.ctx      || 2048,
      threads:  opts.threads,
      template: opts.template,
    });
  }

  // Streaming chat — yields tokens via callback
  async chat(messages, onToken) {
    for await (const token of this.engine.chat(messages)) {
      onToken(token);
    }
  }

  // Non-streaming — returns full string
  async complete(messages) {
    return await this.engine.complete(messages);
  }

  async unload() {
    await this.engine.unload();
  }
}
