# Step 1: Build dell'app Angular
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build --configuration=production

# Step 2: Serve l'app con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/carrot-fe /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
