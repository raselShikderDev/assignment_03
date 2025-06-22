import mongoose from "mongoose";
import app from "./app";

const port = 3000;

async function main() {
  // Connecting with mongodb
  try {
    await mongoose.connect(
      "mongodb+srv://mongodb:mongodb@cluster0.em4cgxh.mongodb.net/librayDB?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("MongoDB has successfully connected");
  } catch (error) {
    console.log(error);
  }

  // Connecting with server
  try {
    app.listen(port, () => {
      console.log(`App is listening on http://localhost:${port}`);
      console.log("Server has successfully connected");
    });
  } catch (error: any) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

main();
