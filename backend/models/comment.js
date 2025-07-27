import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    postId: {
      type: Schema.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
