const path = require("path");
const axios = require("axios");

let url = path.join(process.env.API_URL, "navigation");
let response = {};
let success = false;

const navigate = async (pose2d) => {
    let request = {
        "api_key": process.env.API_KEY, "robot_name": process.env.ROBOT_NAME,
        "pose2d": pose2d
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

module.exports = navigate;       