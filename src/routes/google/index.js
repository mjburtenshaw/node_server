'use strict';

const helpers = require('./helpers');

let google = {};

google.post = async params => {
  try {
    const { body } = params;
    const { app, permissions, resource, action, args } = body;
    console.log(`CALLING google.${app.toLowerCase()}.${resource}.${action} USING ARGS:\n${JSON.stringify(args)}`);
    return await helpers.request({ app, permissions, resource, action, args });
  } catch (error) {
    console.log('CAUGHT ROUTE ERROR: ', error);
  }
};

module.exports = google;