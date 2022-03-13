const mongoose = require("mongoose");

function connectDb() {
  // database connection
  mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  });
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log(`database connection successful`);
  });
}
module.exports = connectDb;
