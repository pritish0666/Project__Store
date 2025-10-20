"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MessageSquare,
  AlertCircle,
  User,
  Calendar as CalendarIcon,
} from "lucide-react";

interface ProjectReviewModalProps {
  project: {
    _id: string;
    title: string;
    tagline: string;
    description: string;
    status: string;
    submittedBy: {
      name: string;
      email: string;
    };
    changeRequest?: {
      feedback: string;
      deadline: string;
      requestedBy: {
        name: string;
      };
      requestedAt: string;
    };
    reviewHistory: Array<{
      action: string;
      adminId: {
        name: string;
      };
      timestamp: string;
      notes?: string;
    }>;
  };
  onClose: () => void;
  onApprove: (projectId: string) => void;
  onReject: (projectId: string, reason: string) => void;
  onRequestChanges: (
    projectId: string,
    feedback: string,
    deadline: Date
  ) => void;
}

const REJECTION_REASONS = [
  "Inappropriate content",
  "Poor quality or incomplete",
  "Does not meet project standards",
  "Duplicate or spam",
  "Technical issues",
  "Missing required information",
  "Other",
];

const FEEDBACK_TEMPLATES = [
  "Please add more screenshots to showcase the project better",
  "The description needs more detail about features and functionality",
  "Add a demo URL or live preview link",
  "Include more information about the tech stack used",
  "The project needs better documentation",
  "Add installation/setup instructions",
  "Include more detailed feature descriptions",
];

export default function ProjectReviewModal({
  project,
  onClose,
  onApprove,
  onReject,
  onRequestChanges,
}: ProjectReviewModalProps) {
  const [activeTab, setActiveTab] = useState<"approve" | "reject" | "changes">(
    "approve"
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const handleApprove = () => {
    onApprove(project._id);
    onClose();
  };

  const handleReject = () => {
    const reason = rejectionReason === "Other" ? customReason : rejectionReason;
    onReject(project._id, reason);
    onClose();
  };

  const handleRequestChanges = () => {
    if (!feedback.trim() || !deadline) return;

    const deadlineDate = new Date(deadline);
    onRequestChanges(project._id, feedback, deadlineDate);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "live":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "needs-changes":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "live":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "needs-changes":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysUntilDeadline = (deadlineString: string) => {
    const deadline = new Date(deadlineString);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-semibold">
              {project.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{project.tagline}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(project.status)}>
              {getStatusIcon(project.status)}
              <span className="ml-1 capitalize">
                {project.status.replace("-", " ")}
              </span>
            </Badge>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Project Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>
                    <strong>Submitted by:</strong> {project.submittedBy.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                  <span>
                    <strong>Email:</strong> {project.submittedBy.email}
                  </span>
                </div>
              </div>
            </div>

            {project.changeRequest && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Change Request
                </h3>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    {project.changeRequest.feedback}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CalendarIcon className="w-3 h-3" />
                    <span>
                      Due: {formatDate(project.changeRequest.deadline)}
                    </span>
                    <span className="text-orange-600 font-medium">
                      ({getDaysUntilDeadline(project.changeRequest.deadline)}{" "}
                      days left)
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Requested by {project.changeRequest.requestedBy.name} on{" "}
                    {formatDate(project.changeRequest.requestedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
              {project.description}
            </p>
          </div>

          {/* Review History */}
          {project.reviewHistory && project.reviewHistory.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Review History</h3>
              <div className="space-y-2">
                {project.reviewHistory.map((entry, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {entry.action.replace("-", " ")}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          by {entry.adminId.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(entry.timestamp)}
                      </span>
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-gray-700 mt-1">
                        {entry.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Tabs */}
          <div className="border-t pt-4">
            <div className="flex space-x-1 mb-4">
              <Button
                variant={activeTab === "approve" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("approve")}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </Button>
              <Button
                variant={activeTab === "reject" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("reject")}
                className="flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
              <Button
                variant={activeTab === "changes" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("changes")}
                className="flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Request Changes
              </Button>
            </div>

            {/* Approve Tab */}
            {activeTab === "approve" && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">
                    Approve Project
                  </h4>
                  <p className="text-sm text-green-700">
                    This will make the project live and visible to all users.
                    This action cannot be undone.
                  </p>
                </div>
                <Button
                  onClick={handleApprove}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Project
                </Button>
              </div>
            )}

            {/* Reject Tab */}
            {activeTab === "reject" && (
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">
                    Reject Project
                  </h4>
                  <p className="text-sm text-red-700">
                    This will permanently reject the project. The user will be
                    notified and can create a new project.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason
                  </label>
                  <select
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select a reason</option>
                    {REJECTION_REASONS.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                {rejectionReason === "Other" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Reason
                    </label>
                    <textarea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Please specify the reason for rejection..."
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={3}
                    />
                  </div>
                )}

                <Button
                  onClick={handleReject}
                  disabled={
                    !rejectionReason ||
                    (rejectionReason === "Other" && !customReason.trim())
                  }
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Project
                </Button>
              </div>
            )}

            {/* Request Changes Tab */}
            {activeTab === "changes" && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Request Changes
                  </h4>
                  <p className="text-sm text-blue-700">
                    Ask the user to make specific improvements. They will have a
                    deadline to resubmit.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback Templates
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => {
                      setSelectedTemplate(e.target.value);
                      if (e.target.value) {
                        setFeedback(e.target.value);
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">
                      Select a template or write custom feedback
                    </option>
                    {FEEDBACK_TEMPLATES.map((template) => (
                      <option key={template} value={template}>
                        {template}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Feedback
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Describe what changes are needed..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    max={
                      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0]
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    User will have until this date to make changes and resubmit
                  </p>
                </div>

                <Button
                  onClick={handleRequestChanges}
                  disabled={!feedback.trim() || !deadline}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Request Changes
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
