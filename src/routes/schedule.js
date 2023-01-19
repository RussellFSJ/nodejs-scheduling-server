const express = require("express");
const router = express.Router();
const createJob = require("../libs/createJob");
const flatted = require("flatted");

// get all schedules in schedules object
router.get("/", (req, res) => {
    let message = `${Object.keys(schedules).length} active schedule(s).`;

    res.json({ "success": true, "message": message, "schedules": flatted.stringify(schedules) });
});

// creates new schedule and adds it to schedules object
router.post("/", (req, res) => {
    let schedule = req.body;
    let schedule_id = req.body.schedule_id;
    let crontab = req.body.crontab;
    let cleaning_plan = req.body.cleaning_plan_name;
    let cleaning_zones = req.body.cleaning_receipt;
    let expiration_date = req.body.expiration_date;

    let success = false;
    let message = `${schedule_id} already exists.`;

    if (!schedules[schedule_id]) {
        try {
            schedule["job"] = createJob(schedule_id, crontab, cleaning_plan, cleaning_zones, expiration_date);
            schedules[schedule_id] = schedule;

            success = true;
            message = `Successfully created ${schedule_id}.`;
        }
        catch (error) {
            message = `Failed to create ${schedule_id}. ${error}`;
        }
    }

    res.json({ "success": success, "message": message, "schedule": flatted.stringify(schedules[schedule_id]) });
});

// get schedule in schedules object
router.get("/:id", (req, res) => {
    let schedule_id = req.params.id;

    let message = `${schedule_id} is active.`;

    if (!schedules[schedule_id]) {
        message = `${schedule_id} does not exist.`;
    }

    res.json({ "success": true, "message": message, "schedule": flatted.stringify(schedules[schedule_id]) });
});

// updates schedule in schedules object
router.put("/:id", (req, res) => {
    let schedule_id = req.params.id;
    let schedule_name = req.body.schedule_name;
    let crontab = req.body.crontab;
    let cleaning_plan = req.body.cleaning_plan_name;
    let cleaning_zones = req.body.cleaning_receipt;
    let expiration_date = req.body.expiration_date;

    let success = false;
    let message = `${schedule_id} does not exist.`;

    if (schedules[schedule_id]) {
        try {
            schedules[schedule_id]["schedule_name"] = schedule_name;
            schedules[schedule_id]["cleaning_plan_name"] = cleaning_plan;
            schedules[schedule_id]["cleaning_receipt"] = cleaning_zones;
            schedules[schedule_id]["crontab"] = crontab;

            schedules[schedule_id]["job"].cancel();
            delete schedules[schedule_id]["job"];

            schedules[schedule_id]["job"] = createJob(schedule_id, crontab, cleaning_plan, cleaning_zones, expiration_date);

            success = true;
            message = `Successfully updated ${schedule_id}.`;
        }
        catch (error) {
            message = `Failed to update ${schedule_id}. ${error}`;
        }
    }

    res.json({ "success": success, "message": message, "schedule": flatted.stringify(schedules[schedule_id]) });
});

// deletes schedule in schedules object
router.delete("/:id", (req, res) => {
    let schedule_id = req.params.id;

    let success = false;
    let message = `${schedule_id} does not exist.`;

    if (schedules[schedule_id]) {
        try {
            schedules[schedule_id]["job"].cancel();
            delete schedules[schedule_id];

            success = true;
            message = `Successfully deleted ${schedule_id}.`;
        }
        catch (error) {
            message = `Failed to delete ${schedule_id}. ${error}`;
        }
    }

    res.json({ "success": success, "message": message, "schedule": flatted.stringify(schedules) });
})

module.exports = router;
