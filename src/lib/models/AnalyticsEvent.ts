import mongoose, { Document, Schema } from "mongoose";

export interface IAnalyticsEvent extends Document {
  type: string;
  userId?: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  payload: Record<string, any>;
  timestamp: Date;
  userAgent?: string;
  url?: string;
  referrer?: string;
}

const analyticsEventSchema = new Schema<IAnalyticsEvent>({
  type: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  projectId: { type: Schema.Types.ObjectId, ref: "Project" },
  payload: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
  userAgent: { type: String },
  url: { type: String },
  referrer: { type: String },
});

// Index for efficient queries
analyticsEventSchema.index({ type: 1, timestamp: -1 });
analyticsEventSchema.index({ projectId: 1, timestamp: -1 });
analyticsEventSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEvent>("AnalyticsEvent", analyticsEventSchema);
