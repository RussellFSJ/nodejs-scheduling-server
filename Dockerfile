# node.js ver 18 image
FROM node:18

# subsequent commands will start from this folder 
WORKDIR /app

# install dependencies first so they can be cached 
# copy file to current working directory
COPY package*.json ./

RUN npm install

# copying over source code 
# from local files to current working directory
# except files from .dockerignore
COPY . .

EXPOSE 8091

# tells the container how to start the process
CMD ["npm", "start"]        