import { WebcastPushConnection } from 'tiktok-live-connector';
import { DEFAULT_TIKTOK_EVENTS, parseExtraEvents } from './eventRegistry.js';
import { ReconnectPolicy } from './reconnectPolicy.js';

export class TikTokLiveService {
  constructor({ username, bus, logger, reconnectDelayMs, maxReconnectDelayMs }) {
    this.username = username;
    this.bus = bus;
    this.logger = logger;
    this.connection = new WebcastPushConnection(this.username);
    this.isShuttingDown = false;
    this.reconnectPolicy = new ReconnectPolicy({
      initialDelayMs: reconnectDelayMs,
      maxDelayMs: maxReconnectDelayMs,
    });
    this.boundEvents = new Set([
      ...DEFAULT_TIKTOK_EVENTS,
      ...parseExtraEvents(process.env.TIKTOK_EXTRA_EVENTS),
    ]);
  }

  bindConnectorEvents() {
    for (const eventName of this.boundEvents) {
      this.connection.on(eventName, (payload) => {
        this.logger.debug(`TikTok event received: ${eventName}`);
        this.bus.emit(eventName, payload);
      });
    }

    this.connection.on('connected', (state) => {
      this.reconnectPolicy.reset();
      this.logger.info('Connected to TikTok LIVE', {
        username: this.username,
        roomId: state?.roomId,
      });
      this.bus.emit('connected', state);
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('Disconnected from TikTok LIVE');
      this.bus.emit('disconnected');
      this.scheduleReconnect();
    });

    this.connection.on('error', (error) => {
      this.logger.error('TikTok LIVE connection error', {
        message: error?.message,
      });
      this.bus.emit('error', { source: 'tiktok', error: error?.message });
      this.scheduleReconnect();
    });
  }

  async connect() {
    try {
      const state = await this.connection.connect();
      this.logger.info('TikTok LIVE handshake complete', {
        roomId: state?.roomId,
      });
    } catch (error) {
      this.logger.error('Initial TikTok LIVE connect failed', {
        message: error?.message,
      });
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    if (this.isShuttingDown) {
      return;
    }

    const delay = this.reconnectPolicy.nextDelayMs();
    this.logger.warn('Scheduling TikTok LIVE reconnect', { delayMs: delay });

    setTimeout(async () => {
      if (this.isShuttingDown) {
        return;
      }

      this.logger.info('Attempting TikTok LIVE reconnect');
      await this.connect();
    }, delay);
  }

  async start() {
    this.bindConnectorEvents();
    await this.connect();
  }

  async stop() {
    this.isShuttingDown = true;
    try {
      await this.connection.disconnect();
    } catch (error) {
      this.logger.warn('Error while disconnecting TikTok LIVE', {
        message: error?.message,
      });
    }
  }
}
