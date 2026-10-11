import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';

const preview = process.argv.includes('--preview');
const root = new URL('../public/', import.meta.url);
const portIndex = process.argv.indexOf('--port');
const port = Number(portIndex >= 0 ? process.argv[portIndex + 1] : process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('Provide a valid port: npm run dev -- --port 3000');
}

const routes = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/src/styles.css', ['src/styles.css', 'text/css; charset=utf-8']],
  ['/src/game.js', ['src/game.js', 'text/javascript; charset=utf-8']],
]);

const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    return response.end('Method not allowed');
  }
  const route = routes.get((request.url || '/').split('?')[0]);
  if (!route) {
    response.writeHead(404);
    return response.end('Not found');
  }
  try {
    const [file, type] = route;
    const contents = await readFile(new URL(file, root));
    response.writeHead(200, {
      'Content-Type': type,
      'Content-Length': contents.byteLength,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(request.method === 'HEAD' ? undefined : contents);
  } catch (error) {
    console.error(error.message);
    response.writeHead(500);
    response.end('Unable to read the game file.');
  }
});

server.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`Luma ${preview ? 'production preview' : 'development'}: http://127.0.0.1:${port}`);
});
