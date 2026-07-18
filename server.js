require("dotenv").config();

const app = require("./src/app");
const connectDb = require("./src/config/database");

connectDb();

const PORT = 4000;

app.listen(PORT, () => {
    console.log(`server is running on Port: http://localhost:${PORT}`);
});
