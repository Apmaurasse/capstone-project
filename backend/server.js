"use strict";

import app from "./app";
const { PORT } = require("./config");
console.log(PORT)
app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});