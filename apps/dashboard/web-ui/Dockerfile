# ----- Build stage -----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json tsconfig.json next.config.mjs ./
RUN npm install
COPY src ./src
RUN npm run build

# ----- Runtime stage -----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
EXPOSE 3000
ENTRYPOINT ["node", "server.js"]
