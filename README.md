# TikTok Live Socket Hub

A production-ready Node.js ES module service that maintains one TikTok LIVE connection and rebroadcasts every captured event to Socket.IO clients.

## Features

- Single persistent TikTok LIVE connection.
- Automatic reconnection with exponential backoff.
- Internal event bus to decouple ingestion from transport.
- Socket.IO fan-out for multiple external consumers.
- Environment-based configuration through `.env`.

## Project structure

```text
.
├── .env.example
├── package.json
├── README.md
└── src
    ├── config
    │   └── env.js
    ├── events
    │   └── eventBus.js
    ├── socket
    │   └── socketServer.js
    ├── tiktok
    │   ├── eventRegistry.js
    │   ├── reconnectPolicy.js
    │   └── tiktokLiveService.js
    ├── utils
    │   └── logger.js
    └── index.js
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create your env file:
   ```bash
   cp .env.example .env
   ```
3. Set `TIKTOK_USERNAME` in `.env`.
4. Start server:
   ```bash
   npm start
   ```

## Socket behavior

Each TikTok event is emitted to Socket.IO clients using the same event name.

Examples:

- `chat`
- `gift`
- `like`
- `follow`
- `share`
- `member`
- `social`
- `roomUser`
- `streamEnd`
- `questionNew`
- `linkMicBattle`
- `linkMicArmies`
- `liveIntro`
- plus additional events configured through `TIKTOK_EXTRA_EVENTS`

## Notes

- The Socket.IO server listens on `PORT` (defaults to `3000`).
- Reconnect timing is controlled by `RECONNECT_DELAY_MS` and `MAX_RECONNECT_DELAY_MS`.
