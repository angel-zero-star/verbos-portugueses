# 🇵🇹 Verbos Portugueses

A flashcard game for learning European Portuguese verb conjugations.

## Features

- **67 verbs** — 33 irregular + 34 regular (-AR, -ER, -IR)
- **Presente & Passado** (Pretérito Perfeito) tenses
- **Accent-tolerant** — correct answers without accents are accepted but flagged
- **Audio pronunciation** — European Portuguese (pt-PT) text-to-speech
- **Progress tracking** — session history with chart and trend analysis
- **Customizable** — toggle individual verbs and tenses on/off
- **Quick filters** — play All/Irregular/Regular, Presente/Passado/Both

## Getting Started

```bash
# Install dependencies
npm install

# Run locally
npm start

# Build for production
npm run build
```

## Deploy to Vercel (free)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" → Import your repo
4. Framework: Create React App (auto-detected)
5. Click Deploy

That's it — you'll get a URL like `verbos-portugueses.vercel.app`.

## Adding New Verbs

Edit `src/App.js` and add to the `ALL_VERBS` array:

```js
{ id:"newverb", verb:"newverb", transl:"English translation", prep:"de", type:"regular-ar",
  presente:{eu:"...",tu:"...",  "ele/ela":"...",nós:"...","eles(as)/vocês":"..."},
  passado:{eu:"...",tu:"...","ele/ela":"...",nós:"...","eles(as)/vocês":"..."}},
```

## License

MIT — use freely, learn Portuguese! 🇵🇹
