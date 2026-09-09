import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const routes = new Map([['/', ['index.html', 'text/html']], ['/src/app.mjs', ['src/app.mjs', 'text/javascript']], ['/src/slug.mjs', ['src/slug.mjs', 'text/javascript']]]);
createServer(async (request, response) => {
  const route = routes.get(new URL(request.url, 'http://fixture.invalid').pathname);
  if (!route) { response.writeHead(404).end('Not found'); return; }
  try { response.writeHead(200, { 'content-type': route[1] }).end(await readFile(new URL(route[0], import.meta.url))); }
  catch { response.writeHead(500).end('Fixture unavailable'); }
}).listen(Number(process.env.PORT), '127.0.0.1');
