const mongoose = require("mongoose");

const connectDB = () => {
  const URI =
      'mongodb+srv://cuongjuno:13082000aA_@cluster0.voxjn.mongodb.net/Kahoot?retryWrites=true&w=majority';
  mongoose.connect(
    URI,
    {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
    (err) => {
      if (!err) {
        console.log("Mongodb connected");
      } else {
        console.log(err);
        process.exit(1);
      }
    }
  );
};

module.exports = connectDB;
