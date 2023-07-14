const mongoose = require("mongoose");

const connect = async (URI) => {
  return mongoose
    .connect(URI)
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = connect;
