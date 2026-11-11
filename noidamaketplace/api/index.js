/**
 * NoidaGym Marketplace - Vercel Serverless Function Entry Point
 * Dispatches incoming requests to the shared request handler.
 */

const handleRequest = require('../server.js');

module.exports = async (req, res) => {
  try {
    await handleRequest(req, res);
  } catch (err) {
    console.error('[Vercel Serverless Invocation Error]', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        error: 'Internal Server Error',
        message: err.message || 'An unexpected error occurred processing the request.'
      }));
    }
  }
};
module.exports.default = module.exports;
