# TinyLink - URL Shortener

A simple URL shortener web application built with Node.js, Express.js, and MongoDB.

## Features

- Create short links with optional custom codes
- Redirect to original URLs with click tracking
- View link statistics
- Delete links
- Clean, responsive web interface

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

The application will be available at `http://localhost:3000`

## API Endpoints

- `POST /api/links` - Create a new link
- `GET /api/links` - List all links
- `GET /api/links/:code` - Get stats for a specific link
- `DELETE /api/links/:code` - Delete a link
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