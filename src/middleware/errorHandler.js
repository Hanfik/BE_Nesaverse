const isProduction = process.env.NODE_ENV === 'production';

const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = isProduction && status === 500
    ? 'Internal Server Error'
    : err.message || 'Internal Server Error';

  if (!isProduction) {
    console.error(`❌ [${status}] ${err.message}`);
    console.error(err.stack);
  }

  res.status(status).json({ error: message });
};

module.exports = errorHandler;
