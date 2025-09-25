var express = require('express');
var router = express.Router();
const fs = require("node:fs");
const path = require("node:path");

/* GET home page. */
fs.readdirSync(__dirname)
  .filter((file) => file !== path.basename(__filename))
  .forEach((file) => {
    const routePath = `/${file.split(".")[0]}`;
    const importPath = path.join(__dirname, file);
    const route = require(importPath);
    router.use(routePath, route);
  })

module.exports = router;
