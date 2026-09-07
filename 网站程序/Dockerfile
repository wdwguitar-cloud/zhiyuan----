FROM node:20-alpine AS frontend-builder
WORKDIR /app/app-frontend
COPY app-frontend/package*.json ./
RUN npm install
COPY app-frontend ./
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --omit=dev
WORKDIR /app
COPY backend ./backend
COPY frontend ./frontend
COPY content-hub ./content-hub
COPY --from=frontend-builder /app/app-frontend/dist ./app-frontend/dist
WORKDIR /app/backend
EXPOSE 8787
CMD ["npm", "start"]
