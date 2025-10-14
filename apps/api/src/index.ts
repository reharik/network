import { config } from './config';
import { container } from './container';

const server = container.resolve('koaServer');

server.listen(config.serverPort, () => {
  console.log(`🚀 Server running on http://localhost:${config.serverPort}`);
});
