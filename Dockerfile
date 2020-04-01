FROM nginx:1.17-alpine

# custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf 

# resources
COPY build /usr/share/nginx/html
