# Stage 0, based on Node.js, to build and compile Angular
FROM node:12 as node
WORKDIR /app
COPY ./ /app/
RUN npm install
RUN npm rebuild node-sass
RUN npm run build -- --prod

 

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:alpine
COPY --from=node /app/dist /usr/share/nginx/html
COPY cert/ /etc/ssl/
##COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

