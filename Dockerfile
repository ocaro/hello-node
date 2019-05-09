FROM node:6
COPY package.json .
RUN npm test

FROM node:6
EXPOSE 8080
COPY server.js .
CMD node server.js
