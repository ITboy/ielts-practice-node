# 1️⃣ Use official Node.js LTS image
FROM node:20-alpine

# 2️⃣ Set working directory inside the container
WORKDIR /app

# 3️⃣ Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy the rest of the application code
COPY . .

# 6️⃣ Expose the port your app listens on
EXPOSE 3000

# 7️⃣ Default command to start the app
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
