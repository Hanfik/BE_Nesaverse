const app = require('./src/app');

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 NesaVerse API running at http://localhost:${PORT}`);
});

// Safety net: log instead of crashing on unexpected async errors
// (e.g. a dropped DB connection emitting an error with no local handler).
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err.message);
});
