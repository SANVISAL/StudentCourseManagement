import app from "./app";
import Connect_MongoDB from "./database,/connectDB/mongodb";
import getConfig from "./utils/config";

async function run() {
  try {
    const config = getConfig(process.env.NODE_ENV);

    const mongoDb = Connect_MongoDB.getinstance();
    await mongoDb.ConnectMongoDB({ url: config.mongourl! });

    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.log("error");
  }
}

run()