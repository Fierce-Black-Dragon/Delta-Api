import mongoose from"mongoose"
const MONGODB_URL = process.env.MONGO_URL
exports.connect = async () => {
    try {
      await mongoose.connect(MONGODB_URL!);
      console.log(`🏪[Database]: DB CONNECTED SUCCESSFULLY`);
    } catch (error) {
      console.log(`🏪[Database]: DB connection failed`);
      console.error(error);
      process.exit(1);
    }
  };