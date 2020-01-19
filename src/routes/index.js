'use strict';

const google = require('./google');

const apiList = [
  'google'
];

const router = async (req, res, next) => {
  if (req.url === '/api/list') res.status(200).send(apiList);
  if (req.url === '/google/') {
    const response = await google.post(req);
    if (response.status === 200) res.status(200).send(response.data);
    else if (response.error) res.status(500).send(response.error);
  };
  next();
};

module.exports = router;