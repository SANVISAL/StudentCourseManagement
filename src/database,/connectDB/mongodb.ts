import mongoose from "mongoose";

class Connect_MongoDB {
  private static instance: Connect_MongoDB;
  private mongourl: string = "";

  public static getinstance(): Connect_MongoDB {
    if (!Connect_MongoDB.instance) {
      Connect_MongoDB.instance = new Connect_MongoDB();
    }
    return Connect_MongoDB.instance;
  }

  public async ConnectMongoDB({ url }: { url: string }): Promise<void> {
    this.mongourl = url;
    try {
      await mongoose.connect(this.mongourl);
      console.log("Successfully connected to MongoDB");
    } catch (error) {
      console.log(`Initial MongoDB connection error ${error}`);
      throw error; 
    }
  }
}

export default Connect_MongoDB
