require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(express.json());

app.use(cors({
    origin: '*'
}));

// routers
const routes = path.join(__dirname, "routes");
const scheduleRouter = require(path.join(routes, "schedule"));

app.use("/schedule", scheduleRouter);

const PORT = process.env.PORT || 8091;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});

