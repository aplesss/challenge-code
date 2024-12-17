
FROM node:18-alpine AS builder

WORKDIR /app


COPY package.json yarn.lock ./


RUN yarn install


COPY . .

ENV VITE_CHALLENGE_WEBSOCKET_URL=ws://localhost:3456
ENV VITE_CHALLENGE_API_URL=http://localhost:8080


RUN yarn build


FROM nginx:alpine


COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
