# Stage 1: Build
FROM node:alpine AS builder

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD [ "npm","run","dev" ]
# RUN npm run build

# # Stage 2: Serve
# FROM nginx:alpine

# WORKDIR /etc/nginx/conf.d
# COPY nginx.conf .

# WORKDIR /usr/share/nginx/html
# COPY --from=builder /app/dist .

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
