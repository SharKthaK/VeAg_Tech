# VeAg Server

Express.js backend server with MongoDB for user management.

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   - Copy `.env.example` to `.env`
   - Add your MongoDB connection string

3. **Start MongoDB**
   - Make sure MongoDB is running locally or use MongoDB Atlas
   - Default local connection: `mongodb://localhost:27017/veag`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Start production server**
   ```bash
   npm start
   ```

## Features

- User authentication and management
- Auto-generated unique user IDs
- MongoDB integration with Mongoose
- RESTful API endpoints
- CORS enabled for frontend communication
- Express validator for input validation

## API Endpoints

### User Routes

- `POST /api/users/auth` - Authenticate or create user
- `GET /api/users/:userId` - Get user by userId
- `GET /api/users/email/:email` - Get user by email
- `PUT /api/users/:userId` - Update user profile

### Health Check

- `GET /api/health` - Server health check

## Environment Variables

Create a `.env` file with:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/veag
```

For MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/veag?retryWrites=true&w=majority
```

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Express Validator
- CORS
- Dotenv
