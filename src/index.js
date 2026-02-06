import { config } from './config/env.js';
import { eventBus } from './events/eventBus.js';
import { createSocketServer } from './socket/socketServer.js';
import { TikTokLiveService } from './tiktok/tiktokLiveService.js';
import { createLogger } from './utils/logger.js';

const logger = createLogger(config.logLevel);

const socketServer = createSocketServer({
  bus: eventBus,
  logger,
  port: config.port,
});

const tiktokService = new TikTokLiveService({
  username: config.tiktokUsername,
  bus: eventBus,
  logger,
  reconnectDelayMs: config.reconnectDelayMs,
  maxReconnectDelayMs: config.maxReconnectDelayMs,
});

const shutdown = async (signal) => {
  logger.warn(`Received ${signal}, shutting down gracefully`);
  await Promise.allSettled([tiktokService.stop(), socketServer.stop()]);
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

const bootstrap = async () => {
  try {
    await socketServer.start();
    await tiktokService.start();
    logger.info('TikTok LIVE event hub started');
  } catch (error) {
    logger.error('Failed to bootstrap TikTok LIVE event hub', {
      message: error?.message,
    });
    process.exit(1);
  }
};

bootstrap();
