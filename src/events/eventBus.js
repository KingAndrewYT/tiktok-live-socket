import { EventEmitter } from 'node:events';

class TikTokEventBus extends EventEmitter {}

export const eventBus = new TikTokEventBus();
