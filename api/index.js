// api/index.js
const fs = require('fs');
const path = require('path');
const tmpPath = require('os').tmpdir();

if (!fs.existsSync(path.resolve(tmpPath, 'anonymous_token'))) {
    fs.writeFileSync(path.resolve(tmpPath, 'anonymous_token'), '', 'utf-8');
}

let cachedApp;

async function getApp() {
    if (cachedApp) return cachedApp;
    const generateConfig = require('../generateConfig');
    await generateConfig();
    const { serveNcmApi } = require('../server');
    const app = await serveNcmApi({ checkVersion: false });
    if (app.server) app.server.close();
    cachedApp = app;
    return cachedApp;
}

module.exports = async (req, res) => {
    const app = await getApp();
    app(req, res);
};
