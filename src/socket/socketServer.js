import { createServer } from 'node:http';
import { Server } from 'socket.io';

export const createSocketServer = ({ bus, logger, port }) => {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    logger.info('Socket client connected', { socketId: socket.id });
    socket.on('disconnect', () => {
      logger.info('Socket client disconnected', { socketId: socket.id });
    });
  });

  bus.on('newListener', (eventName) => {
    if (eventName === 'newListener') {
      return;
    }
    logger.debug('Event bus listener added', { eventName });
  });

  const forward = (eventName, payload) => {
    io.emit(eventName, payload);
  };

  bus.on('connected', (payload) => forward('connected', payload));
  bus.on('disconnected', (payload) => forward('disconnected', payload));
  bus.on('error', (payload) => forward('error', payload));

  // Dynamic pass-through for every TikTok event emitted on the bus.
  const originalEmit = bus.emit.bind(bus);
  bus.emit = (eventName, ...args) => {
    if (eventName !== 'newListener' && eventName !== 'removeListener') {
      io.emit(eventName, ...args);
    }
    return originalEmit(eventName, ...args);
  };

  return {
    start: () =>
      new Promise((resolve) => {
        httpServer.listen(port, () => {
          logger.info('Socket.IO server listening', { port });
          resolve();
        });
      }),
    stop: () =>
      new Promise((resolve, reject) => {
        io.close((ioError) => {
          if (ioError) {
            reject(ioError);
            return;
          }
          httpServer.close((httpError) => {
            if (httpError) {
              reject(httpError);
              return;
            }
            resolve();
          });
        });
      }),
  };
};
