import mongoose, { Document, Schema } from "mongoose";

export interface IBookmark extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const bookmarkSchema = new Schema<IBookmark>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  },
  { timestamps: true }
);

// Ensure one bookmark per user per project
bookmarkSchema.index({ userId: 1, projectId: 1 }, { unique: true });

export default mongoose.models.Bookmark ||
  mongoose.model<IBookmark>("Bookmark", bookmarkSchema);
