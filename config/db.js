const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Conneected to mongodb successfully!!");
  } catch (err) {
    console.log("Failed to connect");
  }
};

module.exports = connectDb;
