import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  body: string;
  helpfulVotes: mongoose.Types.ObjectId[];
  abuseReports: mongoose.Types.ObjectId[];
  status: "pending" | "approved" | "hidden";
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    body: { type: String, required: true, minlength: 10, maxlength: 1000 },
    helpfulVotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    abuseReports: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["pending", "approved", "hidden"],
      default: "approved",
    },
  },
  { timestamps: true }
);

// Ensure one review per user per project
reviewSchema.index({ projectId: 1, userId: 1 }, { unique: true });

export default mongoose.models.Review ||
  mongoose.model<IReview>("Review", reviewSchema);
