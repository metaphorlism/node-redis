const express = require("express");
const app = express();
const Redis = require("./src/config/redis");
const generateUUID = require("./src/utils/UUIDGenerator");

Redis.connect();

app.use(express.json());

app.post("/setkey", (req, res) => {
  try {
    const value = req.body.value;
    const uuid = generateUUID();
    const key = req.body.key + ":" + uuid;

    Redis.valueSet(key, value);

    res.status(201).json({
      status: "success",
      message: "successfully added",
      info: `${key} : ${value}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      message: error,
    });
  }
});

app.get("/getkey", async (req, res) => {
  try {
    const key = req.body.key;
    const value = await Redis.get(key);

    res.status(200).json({
      status: "success",
      message: "retreived successfully",
      info: value,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message(),
    });
  }
});

app.listen(8090, () => {
  console.log("server is running on port: 8090....");
});
