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

  async valueSet(key, value) {
    const client = await this.connect();
    client.set(key, value);
  }

  async get(key) {
    const client = await this.connect();
    return await client.get(key);
  }
}

module.exports = new Redis();
