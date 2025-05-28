import http from 'http';
import express from 'express'
export const app = express()
// Register a simple ping route for health checks
app.get('/ping', (_req, res) => {
  res.send('pong');
});
/**
 * Start the HTTP server on the given port.
 * Returns the http.Server instance for later shutdown.
 */
export function startServer(port: number = Number(process.env.PORT) || 3000) {
  return app.listen(port, () => {
    console.log(`Listening on ${port}`);
  });
}

/**
 * Stop the given HTTP server.
 * Returns a promise that resolves when the server has closed.
 */
export function stopServer(server: http.Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close(err => {
      if (err) return reject(err);
      resolve();
    });
  });
}
// …all your middleware and route registrations…
if (require.main === module) {
  startServer();
}