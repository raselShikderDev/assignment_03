import express, { Request, Response } from "express";
import bookRouter from "./app/controllers/book_controllers";
import borrowRouter from "./app/controllers/borrow_controllers";
const app = express();

app.use(express.json());
app.use("/api/books", bookRouter)
app.use("/api/borrow", borrowRouter)


app.get("/", (req: Request, res: Response) => {
  res.send(
    "Welcome to Library Management API with Express, TypeScript & MongoDB"
  );
});



export default app;
