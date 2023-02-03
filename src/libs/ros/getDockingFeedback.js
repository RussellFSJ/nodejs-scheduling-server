const path = require("path");
const axios = require("axios");

let url = path.join(process.env.API_URL, "docking_feedback");
let response = {};
let docking_feedback = "";

const getDockingFeedback = async () => {
    let request = {
        "api_key": process.env.API_KEY, "robot_name": process.env.ROBOT_NAME,
    };

    try {
        response = await axios.post(url, request);

        docking_feedback = response.data.result;
    }
    catch (error) {
        console.log(error);
    }

    return docking_feedback;
}

module.exports = getDockingFeedback;