const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const formatDate = () => new Date().toISOString();

export const createLogger = (level = 'info') => {
  const activeLevel = LEVELS[level] ?? LEVELS.info;

  const write = (method, threshold, message, meta) => {
    if (activeLevel < threshold) {
      return;
    }

    const payload = meta ? ` ${JSON.stringify(meta)}` : '';
    console[method](`[${formatDate()}] ${message}${payload}`);
  };

  return {
    error: (message, meta) => write('error', LEVELS.error, message, meta),
    warn: (message, meta) => write('warn', LEVELS.warn, message, meta),
    info: (message, meta) => write('log', LEVELS.info, message, meta),
    debug: (message, meta) => write('log', LEVELS.debug, message, meta),
  };
};
