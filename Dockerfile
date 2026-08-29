# FROM node:22-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 4000

# CMD ["npm", "run", "dev"]



FROM node:22-alpine

WORKDIR /app

# Install Git
RUN apk add --no-cache git

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]