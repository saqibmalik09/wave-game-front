Perfect — you’ve got everything wired:
✅ A **singleton socket connection per user**
✅ Independent game event handlers (modular)
✅ React hooks for real-time events
✅ Clean, reusable structure across games

Now you just want **developer documentation** explaining:

* How the socket system works
* What each event does (emit / listen)
* What data structures to send and expect
* How to extend this setup to new games

Below is a **complete documentation file** (`docs/socket-system.md`) written in clean developer format.
You can include this in your repo (`/docs/socket-system.md`) or share with your team.

---

# 🎮 Real-Time Socket System — Developer Documentation

## Overview

This documentation explains the **socket architecture** and **event flow** for real-time game updates (e.g., Teen Patti).
It ensures **one persistent socket connection per user**, shared across all modules and games.

---

## 1. 🔌 Socket Initialization — `socketClient.ts`

### Purpose

Creates and manages a **singleton** Socket.IO connection that is reused across all components, hooks, and games.

### File

`src/lib/socket/socketClient.ts`

### Key Features

* Guarantees **one socket ID per user session**
* Handles **auto reconnection**
* Exposes helper methods:

  * `initSocket()` → Initializes or reuses connection
  * `getSocket()` → Returns existing socket instance (read-only)

### Example

```ts
import { initSocket } from '@/lib/socket/socketClient';

const socket = initSocket(); // Always same socket.id for user
socket.emit('myEvent', { key: 'value' });
```

### Connection Lifecycle Logs

| Event                                | Description                    |
| ------------------------------------ | ------------------------------ |
| 🔌 Creating new socket connection... | First connection setup         |
| ✅ Connected                          | Connected successfully         |
| ♻️ Using existing socket             | Returned same instance         |
| 🔄 Reconnecting socket               | Attempting reconnect           |
| ⚠️ Disconnected                      | Server or network disconnected |

---

## 2. 🌍 Global Events — `useGlobalSocketEvents`

### Purpose

Handles app-wide socket events (e.g., user balance, global notifications).

### File

`src/lib/socket/socketClientGlobal.ts`

### Hook

```ts
useGlobalSocketEvents(userId?: number);
```

### Behavior

| Event                | Direction | Payload                      | Description                                |
| -------------------- | --------- | ---------------------------- | ------------------------------------------ |
| `userIdData`         | 🔼 Emit   | `{ userId }`                 | Requests full user data                    |
| `userIdDataResponse` | 🔽 Listen | `{ balance, username, ... }` | Receives user info (use for Redux updates) |

### Example

```ts
useGlobalSocketEvents(123);
```

---

## 3. ♠️ Teen Patti Game Events — `teenpattiSocketEventHandler.ts`

### Overview

Contains **independent socket handlers and listeners** for Teen Patti gameplay.

Each event is modular — you can call one or multiple as needed.

---

### A. 🧩 `gameConfiguration()`

Fetches configuration (rules, tables, limits) for a specific game ID.

```ts
gameConfiguration({ gameId: 16 });
```

| Direction | Event                       | Payload                          | Response Example |
| --------- | --------------------------- | -------------------------------- | ---------------- |
| 🔼 Emit   | `gameConfiguration`         | `{ "gameId": 16 }`               |                  |
| 🔽 Listen | `gameConfigurationResponse` | `{ success: true, data: {...} }` |                  |

**Example Log**

```
[TeenPatti] 🎯 Requesting game configuration with payload: { gameId: 16 }
[TeenPatti] ✅ Game configuration received successfully:
```

---

### B. ⏱ `useTeenpattiTimerListener()`

Listens for countdown, betting phase, and result calculation timers.

```ts
useTeenpattiTimerListener();
```

| Direction | Event            | Example Data                              |
| --------- | ---------------- | ----------------------------------------- |
| 🔽 Listen | `teenpattiTimer` | `{ phase: "betting", remainingTime: 10 }` |

**Special Behavior**
If the phase is `'winningCalculationTimer'`, it automatically triggers `teenpattiAnnounceGameResult()`.

---

### C. 💰 `placeTeenpattiBet()`

Places a player bet.

```ts
placeTeenpattiBet({
  userId: "123",
  amount: 100,
  tableId: 10,
  betType: "player",
});
```

| Direction | Event               | Payload                                | Response Event         |
| --------- | ------------------- | -------------------------------------- | ---------------------- |
| 🔼 Emit   | `placeTeenpattiBet` | `{ userId, amount, tableId, betType }` | `teenpattiBetResponse` |

**Response Example**

```json
{
  "success": true,
  "message": "Bet accepted for processing",
  "data": {
    "betId": "0072e660-98d6-4a69-a741-ab2dac7ba04e",
    "userId": "123",
    "amount": 100,
    "tableId": 10,
    "betType": "player",
    "game": "teenpatti",
    "timestamp": 1762080475440,
    "status": "pending",
    "newBalance": 4900
  }
}
```

**Log Example**

```
[TeenPatti] 🎯 Placing bet: { userId: "123", amount: 100, tableId: 10, betType: "player" }
[TeenPatti] ✅ Bet placed! New balance: 4900
```

---

### D. 🧾 `teenpattiPotBetsAndUsers()`

Fetches all bets and users participating in the current game pot.

```ts
teenpattiPotBetsAndUsers({ gameId: 16 });
```

| Direction | Event                      | Payload      | Response Event                     |
| --------- | -------------------------- | ------------ | ---------------------------------- |
| 🔼 Emit   | `teenpattiPotBetsAndUsers` | `{ gameId }` | `teenpattiPotBetsAndUsersResponse` |

**Response Example**

```json
{
  "success": true,
  "data": [
    { "userId": "123", "betType": "player", "amount": 100 },
    { "userId": "456", "betType": "dealer", "amount": 200 }
  ]
}
```

**Log Example**

```
[TeenPatti] 🎯 Requesting pot & user list: { gameId: 16 }
[TeenPatti] 📩 Raw teenpattiPotBetsAndUsers received: [...]
```

---

### E. 🏆 `teenpattiAnnounceGameResult()`

Triggered after final timer or server call to announce round winners.

```ts
teenpattiAnnounceGameResult();
```

| Direction | Event                         | Payload | Response Event                        |
| --------- | ----------------------------- | ------- | ------------------------------------- |
| 🔼 Emit   | `teenpattiAnnounceGameResult` | `{}`    | `teenpattiAnnounceGameResultResponse` |

**Response Example**

```json
{
  "success": true,
  "data": {
    "winners": [{ "userId": "123", "amountWon": 500 }],
    "roundId": 112
  }
}
```

**Log Example**

```
[TeenPatti]  Game teenpattiAnnounceGameResultResponse received successfully:
┌───────────┬───────────┐
│ (index)   │ Values    │
├───────────┼───────────┤
│ winners   │ [...]     │
│ roundId   │ 112       │
└───────────┴───────────┘
```

---

## 4. ⚛️ Example Integration — `TeenPattiGame.tsx`

```tsx
'use client';

import {
  gameConfiguration,
  placeTeenpattiBet,
  teenpattiPotBetsAndUsers,
  useTeenpattiBetResponseListener,
  useTeenpattiTimerListener,
} from '@/lib/socket/game/teenpatti/teenpattiSocketEventHandler';

export default function TeenPattiGame() {
  const userId = 123;
  const gameId = { gameId: 16 };

  // Configuration
  useEffect(() => {
    gameConfiguration(gameId);
  }, [gameId]);

  // Listeners
  useTeenpattiTimerListener();
  useTeenpattiBetResponseListener();

  // Pot data
  useEffect(() => {
    teenpattiPotBetsAndUsers(gameId);
  }, [gameId]);

  const handleBetClick = () => {
    placeTeenpattiBet({
      userId: "123",
      amount: 100,
      tableId: 10,
      betType: "player",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white space-y-6">
      <h1 className="text-3xl font-bold">Teen Patti Game</h1>
      <button
        onClick={handleBetClick}
        className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
      >
        🎲 Place Bet (100 on Player)
      </button>
    </div>
  );
}
```

---

## 5. ⚙️ Notes for Multi-Game Support

* This socket architecture is **game-agnostic**.
* To add new games (e.g., Roulette, Poker):

  * Create a new file like `rouletteSocketEventHandler.ts`.
  * Import `initSocket()` from `socketClient.ts`.
  * Follow the same emit/listen pattern.

Example:

```ts
socket.emit('rouletteSpin', { tableId: 5 });
socket.on('rouletteResult', handleResult);
```

---

## ✅ Summary

| Component                        | Role                                        |
| -------------------------------- | ------------------------------------------- |
| `socketClient.ts`                | Maintains single socket connection per user |
| `useGlobalSocketEvents()`        | Global user-level socket updates            |
| `teenpattiSocketEventHandler.ts` | Handles all Teen Patti game events          |
| `TeenPattiGame.tsx`              | React component that initializes listeners  |
| `TeenPattiPage.tsx`              | Page container that renders the game UI     |

---

Would you like me to also include a **sequence diagram** (in text form or image) showing the full event flow — `emit → server → response → handler` for Teen Patti? It’s great for documentation and developer onboarding.
