const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/dental", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch(function (err) {
    console.log(err);
  });

module.exports = mongoose;
