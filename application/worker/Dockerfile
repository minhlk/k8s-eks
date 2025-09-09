FROM node:22-alpine3.22

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .
ENTRYPOINT [ "npm" ]
CMD ["run", "start"]

EXPOSE 9000