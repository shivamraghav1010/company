# TinyLink - URL Shortener

A simple URL shortener web application built with Node.js, Express.js, and MongoDB.

## Features

- Create short links with optional custom codes (1-20 alphanumeric characters)
- Redirect to original URLs with click tracking
- View link statistics
- Delete links
- Clean, responsive web interface
- **User isolation**: Each user only sees their own links (privacy protection)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB database:
   - **Option 1: Local MongoDB**
     - Install MongoDB on your system
     - Start MongoDB service
     - Database will be created automatically

   - **Option 2: Cloud MongoDB (Recommended)**
     - Sign up for [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier available)
     - Create a new cluster
     - Get your connection string

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the `MONGODB_URI` with your MongoDB connection string

5. Start the server:
   ```bash
   npm start
   ```

## User Identification

The application automatically generates a unique user ID for each browser using localStorage. This ensures that:
- Each user only sees their own shortened links
- Links are properly isolated between different users
- No authentication is required for basic functionality
- User data persists across browser sessions

The application will be available at `http://localhost:3000`

## API Endpoints

- `POST /api/links` - Create a new link
- `GET /api/links?userId=<userId>` - List all links for a specific user
- `GET /api/links/:code?userId=<userId>` - Get stats for a specific link (user must own the link)
- `DELETE /api/links/:code?userId=<userId>` - Delete a link (user must own the link)
- `GET /healthz` - Health check (returns system status and database connectivity)

## Routes

- `/` - Dashboard
- `/code/:code` - Link statistics
- `/:code` - Redirect to original URL

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- HTML/CSS/JavaScript (frontend)