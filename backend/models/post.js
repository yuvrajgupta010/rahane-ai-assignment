import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    comments: [
      {
        type: Schema.ObjectId,
        ref: "Comment",
      },
    ],
    createdBy: {
      type: Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

postSchema.methods.toClient = function () {
  const obj = this.toObject({ getters: true, versionKey: false }); // Convert the document to a plain JavaScript object

  // Change _id to id
  obj.id = obj._id;
  delete obj._id;

  return obj;
};

const Post = mongoose.model("Post", postSchema);

export default Post;
