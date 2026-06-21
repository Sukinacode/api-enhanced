// Vercel Serverless 入口
const fs = require('fs');
const path = require('path');
const tmpPath = require('os').tmpdir();

// 初始化 anonymous_token
if (!fs.existsSync(path.resolve(tmpPath, 'anonymous_token'))) {
    fs.writeFileSync(path.resolve(tmpPath, 'anonymous_token'), '', 'utf-8');
}

let cachedApp;

async function getApp() {
    if (cachedApp) return cachedApp;
    const generateConfig = require('./generateConfig');
    await generateConfig();
    const { serveNcmApi } = require('./server');
    const app = await serveNcmApi({ checkVersion: false });
    // 关掉 TCP 监听（Vercel serverless 不需要）
    if (app.server) app.server.close();
    cachedApp = app;
    return cachedApp;
}

module.exports = async (req, res) => {
    const app = await getApp();
    app(req, res);
};
