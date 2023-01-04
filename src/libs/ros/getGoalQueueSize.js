const path = require("path");
const axios = require("axios");

let url = path.join(process.env.API_URL, "goal_queue_size");
let response = {};
let goal_queue_size = 0;

const getGoalQueueSize = async () => {
    let request = {
        "api_key": process.env.API_KEY, "robot_name": process.env.ROBOT_NAME,
    };

    try {
        response = await axios.post(url, request);

        goal_queue_size = response.data.result.goal_queue_size;
    }
    catch (error) {
        console.log(error);
    }

    return goal_queue_size;
}

module.exports = getGoalQueueSize;