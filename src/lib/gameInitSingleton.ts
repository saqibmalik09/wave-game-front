// lib/gameInitSingleton.ts
let initialized = false;

export const gameInitOnce = async (fn: () => Promise<void>) => {
  if (initialized) return;
  initialized = true;
  await fn();
};
