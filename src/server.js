require("express-async-errors");

const cors = require("cors");
const database = require("./database/sqlite");
const express = require("express");
const routes = require("./routes");

const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

database();

app.use((error, req, res, next) => {
  if(error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  console.log(error);

  return res.status(500).json({
    status: "error",
    message: "Internal server error"
  });
});

const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

