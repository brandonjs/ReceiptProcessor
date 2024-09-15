# Use a base image with the required runtime environment
FROM node:21

# Set the working directory in the container
WORKDIR /src

# Copy the application code into the container
COPY . .

# Install dependencies if needed
RUN npm install

# Expose the port your application listens on
EXPOSE 8080

# Define the command to run your application
CMD ["npx", "tsx", "src/app.ts"]
