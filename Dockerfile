FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build the React frontend
RUN npm run build

# Expose the port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Start the server
CMD ["npm", "start"]
