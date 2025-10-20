"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Edit,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Helper functions
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
      return <MessageSquare className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getDaysUntilDeadline = (deadlineString: string) => {
  const deadline = new Date(deadlineString);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
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

interface UserProject {
  _id: string;
  title: string;
  tagline: string;
  status: "pending" | "live" | "rejected" | "needs-changes";
  adminNotes?: string;
  rejectionReason?: string;
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
  createdAt: string;
  updatedAt: string;
  categoryId: { name: string; slug: string };
  tagIds: Array<{ name: string; slug: string; color: string }>;
}

interface UserProjectsResponse {
  projects: UserProject[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

async function fetchUserProjects(page = 1): Promise<UserProjectsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "10",
  });

  const response = await fetch(`/api/user/projects?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user projects");
  }
  return response.json();
}

export function UserDashboard() {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["user", "projects", page],
    queryFn: () => fetchUserProjects(page),
    enabled: !!session,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (!session) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to view your dashboard
          </h1>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center text-red-600">
          Error loading projects: {(error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Projects</h1>
          <p className="text-muted-foreground">
            Manage your submitted projects and track their status
          </p>
        </div>
        <Button asChild>
          <Link href="/profile/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            Submit New Project
          </Link>
        </Button>
      </div>

      {/* Projects List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data?.projects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground mb-4">
              <MessageSquare className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p>
                You haven't submitted any projects yet. Start by submitting your
                first project!
              </p>
            </div>
            <Button asChild>
              <Link href="/profile/projects/new">
                <Plus className="h-4 w-4 mr-2" />
                Submit Your First Project
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data?.projects.map((project) => (
            <Card key={project._id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <Badge
                        className={`${getStatusColor(
                          project.status
                        )} flex items-center gap-1`}
                      >
                        {getStatusIcon(project.status)}
                        {project.status === "needs-changes"
                          ? "Needs Changes"
                          : project.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">
                      {project.tagline}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>📁 {project.categoryId?.name}</span>
                      <div className="flex gap-1">
                        {project.tagIds.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag._id}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                        {project.tagIds.length > 3 && (
                          <span className="text-xs">
                            +{project.tagIds.length - 3} more
                          </span>
                        )}
                      </div>
                      <span>
                        📅 {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Change Request */}
                    {project.status === "needs-changes" &&
                      project.changeRequest && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-blue-800">
                              Changes Requested:
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-blue-600">
                              <Clock className="w-3 h-3" />
                              <span>
                                Due:{" "}
                                {formatDate(project.changeRequest.deadline)}
                              </span>
                              <span
                                className={`font-medium ${
                                  getDaysUntilDeadline(
                                    project.changeRequest.deadline
                                  ) <= 1
                                    ? "text-red-600"
                                    : getDaysUntilDeadline(
                                        project.changeRequest.deadline
                                      ) <= 3
                                    ? "text-orange-600"
                                    : "text-green-600"
                                }`}
                              >
                                (
                                {getDaysUntilDeadline(
                                  project.changeRequest.deadline
                                )}{" "}
                                days left)
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-blue-700 mb-2">
                            {project.changeRequest.feedback}
                          </p>
                          <p className="text-xs text-blue-600">
                            Requested by{" "}
                            {project.changeRequest.requestedBy.name} on{" "}
                            {formatDate(project.changeRequest.requestedAt)}
                          </p>
                        </div>
                      )}

                    {/* Admin Feedback */}
                    {project.status === "rejected" &&
                      project.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                          <h4 className="text-sm font-semibold text-red-800 mb-1">
                            Rejection Reason:
                          </h4>
                          <p className="text-sm text-red-700">
                            {project.rejectionReason}
                          </p>
                        </div>
                      )}

                    {project.adminNotes && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                        <h4 className="text-sm font-semibold text-blue-800 mb-1">
                          Admin Notes:
                        </h4>
                        <p className="text-sm text-blue-700">
                          {project.adminNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {project.status === "live" && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/projects/${project.slug}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {(project.status === "pending" ||
                      project.status === "needs-changes" ||
                      project.status === "rejected") && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/profile/projects/${project._id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {project.status === "rejected" && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/profile/projects/new">
                          <Plus className="h-4 w-4 mr-1" />
                          New Project
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {page} of {data.pagination.pages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page === data.pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Status Legend */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Project Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-800">
                <Clock className="h-3 w-3 mr-1" />
                Pending
              </Badge>
              <span className="text-sm text-muted-foreground">
                Under review by our team
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Live
              </Badge>
              <span className="text-sm text-muted-foreground">
                Approved and published
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800">
                <XCircle className="h-3 w-3 mr-1" />
                Rejected
              </Badge>
              <span className="text-sm text-muted-foreground">
                Needs changes before approval
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
