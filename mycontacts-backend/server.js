const express = require("express");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

connectDb();

const app = express();

//defining the static port number on server
const port = process.env.PORT || 5000;

//add the middleware to parse the data from the request body
app.use(express.json());
//existing router
app.use("/api/contacts", require("./routes/contactRouter"));
//authentication router
app.use("/api/users", require("./routes/userRouter"));

//make listen to server that port number
app.listen(port, () => {
  console.log(`server is running on the port ${port}`);
});
