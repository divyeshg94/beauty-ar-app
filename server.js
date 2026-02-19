const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const DIST = path.join(__dirname, 'dist/beauty-ar-assistant');

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.eot':  'application/vnd.ms-fontobject',
  '.otf':  'font/otf',
  '.txt':  'text/plain',
  '.webmanifest': 'application/manifest+json'
};

http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];

  // Security: prevent directory traversal
  const filePath = path.normalize(path.join(DIST, urlPath));
  if (!filePath.startsWith(DIST)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Try to serve the file, fall back to index.html for SPA routing
  const serveFile = (target) => {
    fs.readFile(target, (err, data) => {
      if (err) {
        // SPA fallback — serve index.html for any unmatched route
        fs.readFile(path.join(DIST, 'index.html'), (err2, indexData) => {
          if (err2) {
            res.writeHead(404);
            res.end('Not found');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(indexData);
        });
        return;
      }
      const ext = path.extname(target).toLowerCase();
      const contentType = MIME[ext] || 'application/octet-stream';
      // Cache static assets for 1 year, never cache HTML
      const cacheControl = ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': cacheControl
      });
      res.end(data);
    });
  };

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      serveFile(filePath);
    } else {
      // Could be a directory or SPA route — fall back to index.html
      serveFile(path.join(DIST, 'index.html'));
    }
  });

}).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving: ${DIST}`);
});
