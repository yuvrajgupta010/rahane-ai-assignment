import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["editor", "admin", "viewer"],
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.toClient = function () {
  const obj = this.toObject({ getters: true, versionKey: false }); // Convert the document to a plain JavaScript object

  // Change _id to id
  obj.id = obj._id;
  delete obj._id;

  // Remove password if it exists
  delete obj.password;

  // Remove timestamp
  delete obj.createdAt;
  delete obj.updatedAt;

  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
