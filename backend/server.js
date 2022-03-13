const express = require("express");
const cors = require("cors");
const ejs = require("ejs");
require("dotenv").config();
const mongoDbConnection = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;

mongoDbConnection();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/showFiles"));
app.use("/files/download", require("./routes/download"));

app.listen(PORT, () => {
  console.log(`port listening on ${PORT}`);
});
