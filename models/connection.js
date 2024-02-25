const mongoose = require("mongoose");

const connectionString =
  "mongodb+srv://admin:pRUpsEtCpmMCR2u1@cluster0.k3gva0a.mongodb.net/hackatweet";
mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Database connected"))
  .catch((error) => console.log(error));
