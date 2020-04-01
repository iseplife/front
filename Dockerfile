FROM nginx:alpine
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx
COPY --from=builder /usr/src/app/build /etc/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]