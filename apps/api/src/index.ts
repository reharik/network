import { config } from './config';
import { container, initializeContainer } from './container';

const startServer = async () => {
  // Initialize container (loads modules from glob or runtime scan)
  await initializeContainer();

  const server = container.resolve('koaServer');

  server.listen(config.serverPort, () => {
    console.log(`🚀 Server running on http://localhost:${config.serverPort}`);
  });
};

void startServer();
