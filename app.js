require("dotenv").config();
const express = require("express");
const DatabaseConnection = require("./app/config/dbcon");
const cors = require("cors");

const app = express();

//database connection
DatabaseConnection();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));


const mainRouter = require("./app/routes/index");
app.use("/api", mainRouter);

// Root API endpoint
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
  });
});

const port = 3004;

app.listen(port, () => {
  console.log("server is running on port", port);
});
