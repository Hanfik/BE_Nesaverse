const channels = require('../data/channels.json');

const getChannels = (req, res) => {
  const { category, search } = req.query;
  let result = [...channels];
  if (category && category !== 'All') {
    result = result.filter((c) => c.category === category);
  }
  if (search) {
    result = result.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  }
  res.json(result);
};

module.exports = { getChannels };
