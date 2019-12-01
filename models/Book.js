import mongoose from "mongoose";
import mongodbErrorHandler from "mongoose-mongodb-errors";

const bookSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    genre: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    imageUrl: {
      type: String,
      required: true,
      default: "/images/no-image-available.png"
    },
    summary: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      required: true,
      trim: true,
      default: "available"
    }
  },
  { timestamps: true }
);

bookSchema.plugin(mongodbErrorHandler);

export default mongoose.models.Book || mongoose.model("Book", bookSchema);
