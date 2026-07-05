const servers = require('../data/servers.json');

const getServers = (req, res) => {
  const { category, search } = req.query;
  let result = [...servers];
  if (category && category !== 'All') {
    result = result.filter((s) => s.categories && s.categories.includes(category));
  }
  if (search) {
    result = result.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  }
  res.json(result);
};

module.exports = { getServers };
