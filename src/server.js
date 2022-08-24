const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use([cors(), morgan("dev"), express.json()]);
app.use("/api/v1/tickets", require("./routes"));

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "Success" });
});

app.use((_req, res, next) => {
  const error = new Error("Resource not found!");
  error.status = 404;
  next(error);
});

app.use((error, _req, res, next) => {});

app.listen(port, () => console.log(`Listening on port ${port}`));
