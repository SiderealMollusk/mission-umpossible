# Use a lightweight Node image
FROM node:18-alpine

WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Enable Vite’s file‐watch polling
ENV CHOKIDAR_USEPOLLING=true
# Forward host’s 5173 → container’s 5173
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev"]