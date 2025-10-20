"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import Link from "next/link";
import ProjectReviewModal from "./project-review-modal";

interface Project {
  _id: string;
  title: string;
  tagline: string;
  description: string;
  status: string;
  avgRating: number;
  ratingsCount: number;
  viewCount: number;
  createdAt: string;
  categoryId: { name: string; slug: string };
  tagIds: Array<{ name: string; slug: string; color: string }>;
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
}

interface ProjectsResponse {
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

async function fetchProjects(
  page = 1,
  search = "",
  status = ""
): Promise<ProjectsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "10",
  });
  if (search) params.append("search", search);
  if (status) params.append("status", status);

  const response = await fetch(`/api/admin/projects?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  return response.json();
}

async function deleteProject(id: string) {
  const response = await fetch(`/api/admin/projects/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete project");
  }
  return response.json();
}

async function updateProjectStatus(id: string, status: string) {
  const response = await fetch(`/api/admin/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error("Failed to update project status");
  }
  return response.json();
}

async function approveProject(id: string): Promise<void> {
  const response = await fetch(`/api/admin/projects/${id}/approve`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to approve project");
  }
}

async function rejectProject(id: string, reason: string): Promise<void> {
  const response = await fetch(`/api/admin/projects/${id}/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to reject project");
  }
}

async function requestChanges(
  id: string,
  feedback: string,
  deadline: Date
): Promise<void> {
  const response = await fetch(`/api/admin/projects/${id}/request-changes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ feedback, deadline }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to request changes");
  }
}

export function AdminProjectsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "projects", page, search, statusFilter],
    queryFn: () => fetchProjects(page, search, statusFilter),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateProjectStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
    },
  });

  const approveMutation = useMutation({
    mutationFn: approveProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
      setShowReviewModal(false);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectProject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
      setShowReviewModal(false);
    },
  });

  const requestChangesMutation = useMutation({
    mutationFn: ({
      id,
      feedback,
      deadline,
    }: {
      id: string;
      feedback: string;
      deadline: Date;
    }) => requestChanges(id, feedback, deadline),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
      setShowReviewModal(false);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    statusMutation.mutate({ id, status: newStatus });
  };

  const handleReviewProject = (project: Project) => {
    setSelectedProject(project);
    setShowReviewModal(true);
  };

  const handleApprove = (projectId: string) => {
    approveMutation.mutate(projectId);
  };

  const handleReject = (projectId: string, reason: string) => {
    rejectMutation.mutate({ id: projectId, reason });
  };

  const handleRequestChanges = (
    projectId: string,
    feedback: string,
    deadline: Date
  ) => {
    requestChangesMutation.mutate({ id: projectId, feedback, deadline });
  };

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
          <h1 className="text-3xl font-bold mb-2">Project Management</h1>
          <p className="text-muted-foreground">
            Manage all projects in your portfolio
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="live">Live</option>
          <option value="rejected">Rejected</option>
          <option value="needs-changes">Needs Changes</option>
        </select>
      </div>

      {/* Projects List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
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
                        variant={
                          project.status === "live" ? "default" : "secondary"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">
                      {project.tagline}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        ⭐ {project.avgRating.toFixed(1)} (
                        {project.ratingsCount})
                      </span>
                      <span>👁️ {project.viewCount} views</span>
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
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {(project.status === "pending" ||
                      project.status === "needs-changes") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReviewProject(project)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/projects/${project._id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    {project.status === "live" && (
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(project._id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

      {/* Review Modal */}
      {showReviewModal && selectedProject && (
        <ProjectReviewModal
          project={selectedProject}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedProject(null);
          }}
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestChanges={handleRequestChanges}
        />
      )}
    </div>
  );
}
