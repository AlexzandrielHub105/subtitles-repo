const { serveHTTP } = require("stremio-addon-sdk");
const express = require("express");
const path = require("path");

const addonInterface = require("./addon");

// Serve the addon (manifest.json, handlers)
serveHTTP(addonInterface, { port: 7000 });

// Serve local static files (like .vtt)
const app = express();
app.use(express.static(path.join(__dirname)));
app.listen(7001, () => {
    console.log("Static files served at: http://127.0.0.1:7001/");
});
