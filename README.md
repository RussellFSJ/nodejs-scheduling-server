# Node.js Scheduling Server

## Introduction

This is a simple scheduling server that runs on `Node.js` which keeps track of schedule jobs meant to run on `FLEXA` as part of the scheduling feature. 

## Setup

You will need to first create a `.env` file before being able to run `src/server.js`. Following `.env.example`:
```
# without quotes " and ' for strings
ROBOT_NAME=flexa
HOME_ZONES={ "Tunnel" : [-5.5, 2, 0] }
PORT=8091
API_KEY=<secret_key>
API_URL=<flexa_fleet_adapter url>
DATABASE_URL=<mongodb url>
```
Run the following command to install the relevant `node_modules`:
```
npm install 
```

## Scheduling Server

This application will read documents from `schedules` collection from `MongoDB` on startup and will create schedule jobs from the entries. `CRUD` endpoints are also available to create/update schedules while the server is running. 

### FLEXA

Please ensure that `flexa_ui` and `flexa_fleet_adapter` are both running in conjunction with the scheduling server. This is a neccessary step as it takes in incoming schedules from `flexa_ui` during robot operation(s) and intructs the robot via `flexa_fleet_adapter`. 

## Docker

### Building the docker image

```
# <dockerhub user>/<image name>:<ver no.>
docker build -t russ1337/nodje_scheduling_server:1.0 --network=host .
```

### Running the docker image

```
# get image id
docker image ls

# runs on port 5001 of your localhost
# https://stackoverflow.com/a/24326540/14372239
docker run -d -p 5001:8091 --env-file .env <image_id>
```