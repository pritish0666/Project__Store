import mongoose, { Document, Schema } from "mongoose";

export interface IChangelogEntry {
  version: string;
  date: Date;
  changes: string[];
}

export interface IChangeRequest {
  feedback: string;
  deadline: Date;
  requestedBy: mongoose.Types.ObjectId;
  requestedAt: Date;
}

export interface IReviewHistoryEntry {
  action: "approve" | "reject" | "request-changes";
  adminId: mongoose.Types.ObjectId;
  timestamp: Date;
  notes?: string;
}

export interface IProject extends Document {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  categoryId: mongoose.Types.ObjectId;
  tagIds: mongoose.Types.ObjectId[];
  techStack: string[];
  repoUrl?: string;
  demoUrl?: string;
  version: string;
  status: "pending" | "live" | "rejected" | "needs-changes";
  heroImage: string;
  screenshots: string[];
  features: string[];
  changelog: IChangelogEntry[];
  avgRating: number;
  ratingsCount: number;
  viewCount: number;
  submittedBy: mongoose.Types.ObjectId;
  adminNotes?: string;
  rejectionReason?: string;
  changeRequest?: IChangeRequest;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reviewHistory: IReviewHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const changelogEntrySchema = new Schema<IChangelogEntry>(
  {
    version: { type: String, required: true },
    date: { type: Date, required: true },
    changes: [{ type: String, required: true }],
  },
  { _id: false }
);

const changeRequestSchema = new Schema<IChangeRequest>(
  {
    feedback: { type: String, required: true },
    deadline: { type: Date, required: true },
    requestedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requestedAt: { type: Date, required: true },
  },
  { _id: false }
);

const reviewHistoryEntrySchema = new Schema<IReviewHistoryEntry>(
  {
    action: {
      type: String,
      enum: ["approve", "reject", "request-changes"],
      required: true,
    },
    adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    timestamp: { type: Date, required: true },
    notes: { type: String },
  },
  { _id: false }
);

const projectSchema = new Schema<IProject>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    tagline: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tagIds: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    techStack: [{ type: String }],
    repoUrl: { type: String },
    demoUrl: { type: String },
    version: { type: String, default: "1.0.0" },
    status: {
      type: String,
      enum: ["pending", "live", "rejected", "needs-changes"],
      default: "pending",
    },
    heroImage: { type: String, required: true },
    screenshots: [{ type: String }],
    features: [{ type: String }],
    changelog: [changelogEntrySchema],
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    ratingsCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminNotes: { type: String },
    rejectionReason: { type: String },
    changeRequest: changeRequestSchema,
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    reviewHistory: { type: [reviewHistoryEntrySchema], default: [] },
  },
  { timestamps: true }
);

// Create text index for search
projectSchema.index(
  {
    title: "text",
    description: "text",
    tagline: "text",
    features: "text",
    "tags.name": "text",
  },
  {
    weights: {
      title: 10,
      tagline: 5,
      description: 3,
      features: 2,
      "tags.name": 1,
    },
  }
);

export default mongoose.models.Project ||
  mongoose.model<IProject>("Project", projectSchema);
