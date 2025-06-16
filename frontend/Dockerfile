FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
COPY index.html ./
COPY . .
RUN npm install
CMD ["npm", "run", "dev"]