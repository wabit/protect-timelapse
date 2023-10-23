FROM node:20

RUN apt-get update && apt-get install -y ffmpeg which

WORKDIR /app

COPY . .

CMD ["node", "app.js"]
