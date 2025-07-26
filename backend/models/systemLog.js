import mongoose from "mongoose";

const Schema = mongoose.Schema;

const systemLogSchema = new Schema(
  {
    action: {
      type: String,
      required: true,
    },
    userId: {
      ref: "User",
      type: Schema.ObjectId,
      required: true,
    },
    details: {
      type: String,
      required: false,
    },
    adminId: {
      ref: "User",
      type: Schema.ObjectId,
      required: false,
    },
  },
  { timestamps: true }
);

systemLogSchema.methods.toClient = function () {
  const obj = this.toObject({ getters: true, versionKey: false }); // Convert the document to a plain JavaScript object

  // Change _id to id
  obj.id = obj._id;
  delete obj._id;

  return obj;
};

const SystemLog = mongoose.model("System Log", systemLogSchema);

export default SystemLog;
