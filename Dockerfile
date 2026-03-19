FROM node:22-alpine AS build

WORKDIR /app

# Dependencias primeiro para aproveitar cache
COPY package*.json ./
RUN npm ci

# Codigo fonte e build Angular
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime

# SPA Angular gerada pelo Angular builder
COPY --from=build /app/dist/ditto/browser /usr/share/nginx/html

EXPOSE 3399

CMD ["nginx", "-g", "daemon off;"]

