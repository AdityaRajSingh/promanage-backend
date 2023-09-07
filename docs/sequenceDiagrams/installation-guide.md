# Installation Documentation

This installation guide will walk you through the steps required to set up the Project Management Software backend on your local environment. Additionally, it provides instructions for configuring the MongoDB database on MongoDB Atlas and setting up the necessary environment variables using a `.env` file.

## Prerequisites

Before you begin, ensure you have the following prerequisites:

- Node.js installed (https://nodejs.org/)
- npm (Node Package Manager) installed
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- Google OAuth 2.0 credentials for Google Sign-In (https://console.cloud.google.com/apis/credentials)
- OpenAI API Key (https://beta.openai.com/signup/)

## Setting Up MongoDB Atlas

1. **Create a MongoDB Atlas Account:**

   If you don't have an account, sign up for MongoDB Atlas by visiting https://www.mongodb.com/cloud/atlas. Follow the registration process to create your account.

2. **Create a Cluster:**

   - After logging in to MongoDB Atlas, click the "Clusters" tab in the left-hand sidebar.
   - Click the "Build a New Cluster" button.
   - Follow the on-screen instructions to create your cluster. Choose the settings that best suit your needs.

3. **Whitelist Your IP Address:**

   - In MongoDB Atlas, navigate to the "Network Access" tab.
   - Click the "Add IP Address" button.
   - Whitelist your current IP address or specify a range of IP addresses that are allowed to connect to your database.

4. **Create a Database User:**

   - In MongoDB Atlas, go to the "Database Access" tab.
   - Click the "Add New Database User" button.
   - Create a new user with appropriate privileges for your database.

5. **Get the Connection String:**

   - In MongoDB Atlas, click the "Clusters" tab.
   - Click the "Connect" button for your cluster.
   - Follow the instructions to get the connection string. It should look something like this:

     ```
     mongodb+srv://<username>:<password>@clustername.mongodb.net/<database>
     ```

## Environment Variables

Before running the backend, you need to create a `.env` file in the root directory of the repository and configure the following environment variables:

```env
# MongoDB Atlas URI
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

# Google OAuth 2.0 Client ID and Secret
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# OpenAI API Key
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

Replace the placeholders with your actual credentials.

## Installing Dependencies

To install the required dependencies, follow these steps:

1. Open a terminal and navigate to the root directory of the project.

2. Run the following command to install the dependencies:

   ```bash
   npm install
   ```

## Running the Backend

Once you have completed the above steps, you can start the backend server:

```bash
npm start
```

The backend should now be running locally at `http://localhost:3000`.

Congratulations! You have successfully set up the Project Management Software backend on your local environment. You can now integrate it with the frontend or use it as needed for your project management needs.
