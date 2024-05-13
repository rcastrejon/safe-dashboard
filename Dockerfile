FROM nginx:1.21.3-alpine as runner

ARG API_PATH
ENV NODE_ENV production

RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY dist /usr/share/nginx/html
RUN touch /etc/nginx/nginx.conf

RUN <<EOF
echo "user nginx;" >> /etc/nginx/nginx.conf
echo "worker_processes auto;" >> /etc/nginx/nginx.conf
echo "" >> /etc/nginx/nginx.conf
echo "error_log /var/log/nginx/error.log notice;" >> /etc/nginx/nginx.conf
echo "pid       /var/run/nginx.pid;" >> /etc/nginx/nginx.conf
echo "" >> /etc/nginx/nginx.conf
echo "" >> /etc/nginx/nginx.conf
echo "events {" >> /etc/nginx/nginx.conf
echo "    worker_connections 1024;" >> /etc/nginx/nginx.conf
echo "}" >> /etc/nginx/nginx.conf
echo "" >> /etc/nginx/nginx.conf
echo "" >> /etc/nginx/nginx.conf
echo "http {" >> /etc/nginx/nginx.conf
echo "    log_format main '\$remote_addr - \$remote_user [\$time_local] |\$request| '" >> /etc/nginx/nginx.conf
echo "                    '\$status \$body_bytes_sent |\$http_referer| '" >> /etc/nginx/nginx.conf
echo "                    '|$http_user_agent| |$http_x_forwarded_for|';" >> /etc/nginx/nginx.conf
echo "" >> /etc/nginx/nginx.conf
echo "    access_log /var/log/nginx/access.log main;" >> /etc/nginx/nginx.conf
echo "" >> /etc/nginx/nginx.conf
echo "    sendfile on;" >> /etc/nginx/nginx.conf
echo "    tcp_nopush on;" >> /etc/nginx/nginx.conf
echo "    tcp_nodelay on;" >> /etc/nginx/nginx.conf
echo "    keepalive_timeout 65;" >> /etc/nginx/nginx.conf
echo "    types_hash_max_size 2048;" >> /etc/nginx/nginx.conf
echo "" >> /etc/nginx/nginx.conf
echo "    include /etc/nginx/mime.types;" >> /etc/nginx/nginx.conf
echo "    default_type application/octet-stream;" >> /etc/nginx/nginx.conf
echo "" >> /etc/nginx/nginx.conf
echo "    # Load modular configuration files from the /etc/nginx/conf.d directory." >> /etc/nginx/nginx.conf
echo "    include /etc/nginx/conf.d/*.conf;" >> /etc/nginx/nginx.conf
echo "" >> /etc/nginx/nginx.conf
echo "    server {" >> /etc/nginx/nginx.conf
echo "        listen 80;" >> /etc/nginx/nginx.conf
echo "        server_name localhost;" >> /etc/nginx/nginx.conf
echo "" >> /etc/nginx/nginx.conf
echo "        location /api/ {" >> /etc/nginx/nginx.conf
echo "            proxy_pass $API_PATH;" >> /etc/nginx/nginx.conf
echo "            proxy_http_version 1.1;" >> /etc/nginx/nginx.conf
echo "            proxy_set_header Upgrade \$http_upgrade;" >> /etc/nginx/nginx.conf
echo "            proxy_set_header Connection 'upgrade';" >> /etc/nginx/nginx.conf
echo "            proxy_set_header Host \$host;" >> /etc/nginx/nginx.conf
echo "            proxy_cache_bypass \$http_upgrade;" >> /etc/nginx/nginx.conf
echo "        }" >> /etc/nginx/nginx.conf
echo "" >> /etc/nginx/nginx.conf
echo "        location /app {" >> /etc/nginx/nginx.conf
echo "            gzip on;" >> /etc/nginx/nginx.conf
echo "            gzip_proxied any;" >> /etc/nginx/nginx.conf
echo "            gzip_comp_level 6;" >> /etc/nginx/nginx.conf
echo "            gzip_buffers 16 8k;" >> /etc/nginx/nginx.conf
echo "            gzip_http_version 1.1;" >> /etc/nginx/nginx.conf
echo "            gzip_types text/css application/javascript application/json application/font-woff application/font-tff image/gif image/png image/svg+xml application/octet-stream;" >> /etc/nginx/nginx.conf
echo "            gzip_vary on;" >> /etc/nginx/nginx.conf
echo "" >> /etc/nginx/nginx.conf
echo "            alias /usr/share/nginx/html;" >> /etc/nginx/nginx.conf
echo "            index index.html index.htm;" >> /etc/nginx/nginx.conf
echo "            try_files \$uri \$uri/ /index.html =404;" >> /etc/nginx/nginx.conf
echo "        }" >> /etc/nginx/nginx.conf
echo "    }" >> /etc/nginx/nginx.conf
echo "}" >> /etc/nginx/nginx.conf
EOF

CMD ["nginx", "-g", "daemon off;"]
