# Library Management System

A simple Library Management System built with Express, TypeScript, and MongoDB (Mongoose).

## Features

- Manage books with validation and filtering
- Borrow books with business logic (availability check, copies update)
- Summary of borrowed books using aggregation pipeline
- Proper API responses and error handling

## API Endpoints

- **POST /api/books** - Create a new book  
- **GET /api/books** - Get all books with optional filtering, sorting, and limiting  
- **GET /api/books/:bookId** - Get a single book by ID  
- **PATCH /api/books/:bookId** - Update a book  
- **DELETE /api/books/:bookId** - Delete a book  
- **POST /api/borrow** - Borrow a book (with availability check)  
- **GET /api/borrow** - Get summary of borrowed books  

## Tech Stack

- Node.js, Express.js
- TypeScript
- MongoDB with Mongoose
- Zod for validation

## Running the Project

1. Install dependencies:  
   ```bash
   npm install
