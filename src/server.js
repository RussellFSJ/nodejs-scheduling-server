// Define "require"
require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();


app.use(express.json());

app.use(cors({
    origin: '*'
}));

// mongodb connection
const mongoose = require("mongoose");
// https://stackoverflow.com/questions/74747476/deprecationwarning-mongoose-the-strictquery-option-will-be-switched-back-to
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database. "));


// schedule(s)
global.schedules = {};
getSchedule = require("./libs/getSchedules");
const createJob = require("./libs/createJob");
getSchedule().then((data) => {
    data.forEach(schedule => {
        schedule = schedule.toJSON();

        schedule["job"] = createJob(
            schedule["schedule_id"],
            schedule["crontab"],
            schedule["cleaning_plan_name"],
            schedule["expiration_date"]
        );

        schedules[schedule["schedule_id"]] = schedule;
    });
    // console.log(global.schedules)
});

// routers
const routes = path.join(__dirname, "routes");
const indexRouter = require(path.join(routes, "index"));
const scheduleRouter = require(path.join(routes, "schedule"));

app.use("/", indexRouter);
app.use("/schedules", scheduleRouter);

const PORT = process.env.PORT || 8091;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});
