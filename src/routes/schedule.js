const express = require("express");
const router = express.Router();
const schedule = require('node-schedule');

router.post("/", async (req, res) => {
    let job = req.body.name;
    let cleaning_date = req.body.cleaning_date.split("-");
    let cleaning_time = req.body.cleaning_time.split(":");
    let map_name = req.body.map_name;

    // console.log(cleaning_date);
    // console.log(cleaning_time);
    const crontab_str = `${cleaning_time[1]} ${cleaning_time[0]} * * *`;

    // const job = schedule.scheduleJob(crontab_str, () => {
    //     console.log("Came from UI")
    // });

    res.json({ "message": crontab_str })
});

module.exports = router;
