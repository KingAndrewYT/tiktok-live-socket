import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const required = (value, key) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const config = {
  tiktokUsername: required(process.env.TIKTOK_USERNAME, 'TIKTOK_USERNAME'),
  port: toNumber(process.env.PORT, 3000),
  reconnectDelayMs: toNumber(process.env.RECONNECT_DELAY_MS, 5000),
  maxReconnectDelayMs: toNumber(process.env.MAX_RECONNECT_DELAY_MS, 30000),
  logLevel: process.env.LOG_LEVEL ?? 'info',
};
