FROM node:25.6.1-alpine3.22 AS dev

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]



# production point of view

# # build+base stage

# FROM node:24-alpine3.22 AS build

# WORKDIR /src

# COPY package.json package-lock.json* ./

# RUN npm install

# COPY . .

# RUN npm run build



# # production stage

# FROM nginx:alpine as prod

# COPY --from=build /src/dist /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]


