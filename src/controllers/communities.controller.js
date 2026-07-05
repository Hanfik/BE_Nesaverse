const communities = require('../data/communities.json');

const getCommunities = (req, res) => {
  res.json(communities);
};

module.exports = { getCommunities };
