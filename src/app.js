const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const communityRoutes = require("./routes/community");

const app = express();


app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));


app.use("/api/community", communityRoutes);


app.get("/", (req, res) => {
  res.send("Hello, TibebNet Community API is running!");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ message });
});

module.exports = app;

