import mongoose, { Schema, Document } from "mongoose";

// Define an interface for the Post document
export interface IPost extends Document {
  title: string;
  content: string;
}

// Create the Post schema
const postSchema: Schema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Post model
const Post = mongoose.model<IPost>("Post", postSchema);
export default Post;
