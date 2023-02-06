const path = require("path");
const axios = require("axios");

let url = path.join(process.env.API_URL, "change_robot_state");
let response = {};
let success = false;

const changeRobotState = async (state) => {
    let request = {
        "api_key": process.env.API_KEY, "robot_name": process.env.ROBOT_NAME,
        "state": state
    };

    try {
        response = await axios.post(url, request);

        success = response.data.success;
    }
    catch (error) {
        console.log(error);
    }

    return success;
}

module.exports = changeRobotState;       