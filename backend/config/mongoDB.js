import mongoose from "mongoose";

export let MONGODB_URI;
if (process.env.SERVER_ENV === "PROD") {
  MONGODB_URI = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@chat-cast.pln1iiu.mongodb.net/chat-cast?retryWrites=true&w=majority&appName=chat-cast`;
} else {
  MONGODB_URI = `mongodb://localhost:27017/role-based-app`;
}

export const mongoDBConnection = mongoose
  .connect(MONGODB_URI)
  .then((connection) => connection);
