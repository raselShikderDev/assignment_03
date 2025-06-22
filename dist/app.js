"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controllers_1 = __importDefault(require("./app/controllers/book_controllers"));
const borrow_controllers_1 = __importDefault(require("./app/controllers/borrow_controllers"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/books", book_controllers_1.default);
app.use("/api/borrow", borrow_controllers_1.default);
app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Library Management API</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f4f4f9;
          color: #333;
          text-align: center;
          padding: 50px;
        }
        h1 {
          color: #2c3e50;
        }
        p {
          font-size: 1.2em;
        }
        code {
          background: #eee;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .container {
          max-width: 700px;
          margin: auto;
          background: #fff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        footer {
          margin-top: 30px;
          font-size: 0.9em;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📚 Library Management API</h1>
        <p>Welcome! This is a RESTful API built with <strong>Express</strong>, <strong>TypeScript</strong>, and <strong>MongoDB</strong>.</p>
        <p>Use endpoints like:</p>
        <ul style="text-align: left; display: inline-block;">
          <li><code>POST /api/books</code> — Add a new book</li>
          <li><code>GET /api/books</code> — List all books</li>
          <li><code>GET /api/books/:bookId</code> — Get book details</li>
          <li><code>PATCH /api/books/:bookId</code> — Update book</li>
          <li><code>DELETE /api/books/:bookId</code> — Delete book</li>
          <li><code>POST /api/borrow</code> — Borrow a book</li>
          <li><code>GET /api/borrow</code> — Borrowed books summary</li>
        </ul>
        <p>Check the <code>README.md</code> for usage details.</p>
        <footer>Made with ❤️ by Rasel Shikder</footer>
      </div>
    </body>
    </html>
  `);
});
exports.default = app;
