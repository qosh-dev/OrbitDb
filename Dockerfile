FROM node:9-slim
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 8080
# CMD ["npm", "run", "docs"]
CMD ["node", "./dataModels/docs/docs.js"]