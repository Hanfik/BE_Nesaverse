const app = require('../src/app');

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 NesaVerse API running at http://localhost:${PORT}`);
});

module.exports = app;
