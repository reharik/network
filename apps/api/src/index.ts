import { container } from './container';

const PORT = process.env.PORT || 3000;

const server = container.resolve('koaServer');

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
