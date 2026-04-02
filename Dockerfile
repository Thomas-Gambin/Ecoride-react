FROM node:22-bookworm

LABEL org.opencontainers.image.title="ecoride-react"
LABEL org.opencontainers.image.description="Frontend React / Vite (dev)"

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint-app.sh
RUN chmod +x /usr/local/bin/docker-entrypoint-app.sh

EXPOSE 5173

ENTRYPOINT ["/usr/local/bin/docker-entrypoint-app.sh"]
