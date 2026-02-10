# Authentication API

A production-ready authentication backend built with Node.js, Express, and MongoDB.
Implements JWT-based authentication with access and refresh tokens, secure password
handling, and a clean service-based architecture.

---

## Features

- User registration and login
- JWT access and refresh tokens
- Secure password hashing with bcrypt
- Forgot and reset password flow
- Change password (authenticated)
- Logout and token invalidation
- Centralized error handling
- Request validation using Joi
- Clean layered architecture

---

## Project Structure

.
├── src/
│   ├── app.js
│   ├── server.js
│   ├── schema.js
│   ├── config/
│   │   └── db.js
│   ├── constants/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
│
|
├── .gitignore
├── README.md
├── package.json
└── package-lock.json

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (Access & Refresh Tokens)
- bcrypt
- Joi

---

## Environment Variables

Create a `.env` file in the root directory.

PORT=PORT  
MONGO_URI=your_mongodb_connection_string  
JWT_ACCESS_SECRET=your_access_token_secret  
JWT_REFRESH_SECRET=your_refresh_token_secret  

---

## API Endpoints

### Public Routes

POST   /api/users/register  
POST   /api/users/login  
POST   /api/users/forgot-password  
POST   /api/users/reset-password/:token  
POST   /api/users/refresh-token  

---

### Protected Routes (Authentication Required)

POST    /api/users/logout  
PATCH   /api/users/change-password  
DELETE  /api/users/delete-user  

---

## Architecture

Route → Middleware → Controller → Service → Model

- Routes define endpoints
- Middleware handles authentication, validation, and errors
- Controllers handle request and response
- Services contain business logic
- Models manage database interaction

---

## Security

- Passwords hashed using bcrypt
- Hashed password reset tokens
- JWT access and refresh token separation
- Centralized error handling
- Input validation and sanitization

---

## Author

Sumit Shah   
Node.js | Express | MongoDB | REST APIs
