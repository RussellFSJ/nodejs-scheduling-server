const path = require("path");
const axios = require("axios");

const endpoint = "/goal_queue_size"
const url = new URL(`${process.env.API_URL}${endpoint}`);

const getGoalQueueSize = async () => {
    let request = {
        "api_key": process.env.API_KEY, 
        "robot_name": process.env.ROBOT_NAME,
    };
    
    let goal_queue_size = 0;

    try {
        const response = await axios.post(url, request)
        return new Promise((resolve, reject) => {
            goal_queue_size = response.data.result.goal_queue_size;
            console.log(response.data.result);
            resolve(goal_queue_size);
        });
    }
    catch (error) {
        console.log(error);

        // This is a failure case
        goal_queue_size = -2;
        return goal_queue_size;
    }

}

module.exports = getGoalQueueSize;