# SportNest (Server)

## Purpose
The SportNest Server is the backend powerhouse for the SportNest application. Built with Express.js and MongoDB, it provides a secure and scalable RESTful API to handle facility listings, booking management, and user-related data, ensuring smooth communication with the frontend.

## Live URL
[https://sport-nest-9-server.vercel.app](https://sport-nest-9-server.vercel.app)

## Features
- **RESTful API Endpoints:** Clean and efficient endpoints for CRUD operations on facilities and bookings.
- **Secure Authentication:** Integrated JWT verification using `jose-cjs` to protect private routes and ensure data security.
- **MongoDB Integration:** High-performance data storage and retrieval using MongoDB, with optimized queries for searching and filtering.
- **Protected Routes:** Middleware-based authorization to ensure that only authenticated users can perform sensitive actions like adding or deleting facilities.
- **CORS Enabled:** Configured to safely handle cross-origin requests from the SportNest client.
- **Environment Driven Configuration:** Secure management of database URIs, secrets, and environment variables using `dotenv`.

## NPM Packages Used
- **express**: ^5.2.1
- **mongodb**: ^7.2.0
- **cors**: ^2.8.6
- **dotenv**: ^17.4.2
- **jose-cjs**: ^6.2.3
