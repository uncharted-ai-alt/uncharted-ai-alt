# 🍩 Donut Corp v2

> CLI e API local para LLMs, agora powered by **@uncharted-ai/donut-runtime**.  
> Zero compilação C++. Instala em qualquer PC com `npm install -g @uncharted-ai/donut-corp`.

---

## Arquitetura

```
@uncharted-ai/donut-corp        ← você instala isso
        │
        │  depende de
        ▼
@uncharted-ai/donut-runtime     ← engine de inferência própria
        │
        ├── gguf/reader.js      ← lê modelos .gguf direto
        ├── engine/ops.js       ← matmul/attention em JS (SIMD via V8)
        ├── engine/transformer  ← forward pass LLaMA/Mistral/Phi/Gemma
        └── tokenizer/          ← BPE tokenizer
```

**Sem llama.cpp. Sem compilação. Funciona direto.**

---

## Install

```bash
npm install -g @uncharted-ai/donut-corp
```

## Uso

```bash
donut hw                        # detecta seu hardware (CPU/GPU/RAM)
donut pull tinyllama            # baixa modelo (638MB com Q4)
donut run tinyllama             # chat interativo
donut run ./meu-modelo.gguf    # ou aponta direto para um .gguf
donut serve                     # API OpenAI-compatible na porta 11434
donut list                      # modelos instalados
donut remove tinyllama          # remove e libera espaço
donut prune                     # limpa downloads incompletos
```

## API OpenAI-compatible

```bash
donut serve
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'donut',
});

const stream = await client.chat.completions.create({
  model: 'llama3.2-3b:q4',
  messages: [{ role: 'user', content: 'Olá!' }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}
```

## Como biblioteca

```javascript
import { DonutEngine } from '@uncharted-ai/donut-corp';

const engine = new DonutEngine();
await engine.load('./modelo.gguf');

for await (const token of engine.chat([
  { role: 'user', content: 'Explica transformers em 3 linhas' }
])) {
  process.stdout.write(token);
}
```

## Modelos disponíveis

| Model | Params | Q4 Size |
|-------|--------|---------|
| `tinyllama` | 1.1B | **638MB** |
| `qwen2.5-1.5b` | 1.5B | **986MB** |
| `gemma2-2b` | 2B | **1.6GB** |
| `llama3.2-3b` | 3B | **2.0GB** |
| `phi3-mini` | 3.8B | **2.2GB** |
| `mistral-7b` | 7B | **4.1GB** |

## License

MIT © Uncharted AI / Donut Corp
