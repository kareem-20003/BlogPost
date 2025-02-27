const app = require("./app");

require("dotenv").config();

// DB
const connection = require("./db.connection");

// Server

connection().then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server Is Running On ${process.env.PORT}`)
    );
}).catch((err) => {
    console.error("Error Occured while Connecting to db: ", err)
})

module.exports = app;
