# NodeJS with Redis Database

## Redis Docker Compose

**_you can run `docker compose up -d` to create the docker image/container of the redis server_**

```yaml
version: "3.8"
services:
  cache:
    image: redis:6.2-alpine
    restart: always
    ports:
      - "6379:6379"
    command: redis-server --save 20 1 --loglevel warning --requirepass eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81
    volumes:
      - cache:/data
volumes:
  cache:
    driver: local
```

## Packages Inused

**_Prerequisites_**

```bash
npm install express redis dotenv uuid
```

## Redis credentials

```java
REDIS_HOST='YOUR_REDIS_HOST'
REDIS_PORT='YOUR_REDIS_PORT'
REDIS_PASSWORD='YOUR_REDIS_PASSWORD'
```

**_you can ignore the `REDIS_PASSWORD` if you don't have one_**

## Redis configuration

_Create a `src/config` folder_

### In a `redis.js` file, create a `Redis` class

#### Redis connect method to connect to Redis server

```javascript
const redis = require("redis");
require("dotenv").config({ path: ".env.local" });

class Redis {
  async connect() {
    return await redis
      .createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      })
      .on("error", (err) => console.log("Redis Client Error", err))
      .connect();
  }
}

module.exports = new Redis();
```

**_If you only want to connect to your local redis server you can just use `redis.createClient()`_**

**_In my case I connect to my redis with host,port and password properties within the `createClient()`_**

#### Create a method to set value to redis database

**_add `setValue()` into the `Redis` class_**

```javascript
async valueSet(key, value) {
  const client = await this.connect();
  client.set(key, value);
}
```

#### Create a method to get value from redis database

**_add `get()` into the `Redis` class_**

```javascript
async get(key) {
  const client = await this.connect();
  return await client.get(key);
}
```

**_With all of the above stuffs we are done configuring Redis methods and ready to test_**

## Redis is ready to test

_before implementing the `index.js` file we need a UUID generator method to make our redis key unique_

_Create `utils` folder and a `UUIDGenerator.js` file_

```javascript
const { v4: uuidv4 } = require("uuid");

const generateUUID = () => {
  return uuidv4();
};

module.exports = generateUUID;
```

**_Create `index.js` file_**

```javascript
const express = require("express");
const app = express();
const Redis = require("./src/config/redis");
const generateUUID = require("./src/utils/UUIDGenerator");

// connect to redis server
Redis.connect();

app.use(express.json());

// a POST request to set value to Redis Database
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

// a GET request to get value from Redis Database by Key
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
```

Project Repository: https://github.com/metaphorlism/node-redis

## Contact Us

- :mailbox: yimsotharoth999@gmail.com
- [GitHub](https://github.com/metaphorlism)
- [Facebook Page](https://www.facebook.com/Metaphorlism)
- [Instagram: Metaphorlism](https://www.instagram.com/metaphorlism/)
