FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN \
  apt-get update -y && \
  apt-get install xserver-xorg-dev libxi-dev libxext-dev -y 
  
RUN npm install
RUN npm install -g nodemon

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "index.js" ]