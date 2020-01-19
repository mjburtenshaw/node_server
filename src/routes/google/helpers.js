'use strict';

const { google } = require('googleapis');
const fs = require('fs-extra');
/* fs will read files from the context of the main directory as referenced in package.json */
const config = fs.readJsonSync('./secrets/google.service-account.secrets.json');

let helpers = {};

const authenticate = async params => {
  try {
    const { scopes } = params;
    const auth = new google.auth.JWT(config.client_id, null, config.private_key, scopes, 'malcolm@streemly.co');
    await auth.authorize();
    return auth;
  } catch (error) {
    console.log('ERROR AUTHENTICATING SERVICE ACCOUNT: ', error);
  }
};

const getScopes = params => {
  let scopes = [];
  const { app, permissions } = params;
  if (app === 'DRIVE' && permissions === 'FULL') scopes.push('https://www.googleapis.com/auth/drive');
  if (app === 'DOCS'  && permissions === 'FULL') scopes.push('https://www.googleapis.com/auth/drive');
  return scopes;
};

const getService = async params => {
  try {
    let service;
    const { app, permissions } = params;
    const scopes = getScopes({ app, permissions });
    const auth = await authenticate({ scopes });
    if (app === 'DRIVE') service = google.drive({ version: 'v3', auth });
    if (app === 'DOCS' ) service = google.docs({  version: 'v1', auth });
    return service;
  } catch (error) {
    console.log('ERROR GETTING SERVICE TYPE: ', error);
  };
};

helpers.request = async params => {
  const { app, permissions, resource, action, args } = params;
  try {
    const service = await getService({ app, permissions });
    const result = await service[resource][action].apply(service, args);
    if (result.error) console.log(`ERROR FROM google.${app}.${resource}.${action}:`, result);
    else return result;
  } catch (error) {
    console.log(`CAUGHT ERROR WHILE CALLING google.${app}.${resource}.${action}:`, error);
  };
};
 
module.exports = helpers;