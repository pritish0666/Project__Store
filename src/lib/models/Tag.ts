import mongoose, { Document, Schema } from "mongoose";

export interface ITag extends Document {
  name: string;
  slug: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const tagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    color: { type: String, default: "#6b7280" },
  },
  { timestamps: true }
);

export default mongoose.models.Tag || mongoose.model<ITag>("Tag", tagSchema);
