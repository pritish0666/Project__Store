"use client";

import { useQuery } from "@tanstack/react-query";
import { ProjectCard } from "./project-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Project {
  _id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  heroImage: string;
  avgRating: number;
  ratingsCount: number;
  status: "live" | "demo" | "code";
  categoryId: {
    name: string;
    slug: string;
    color: string;
  };
  tagIds: Array<{
    name: string;
    slug: string;
    color: string;
  }>;
  techStack: string[];
  demoUrl?: string;
  repoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsResponse {
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

async function fetchProjects(filters: any = {}): Promise<ProjectsResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        searchParams.set(key, value.join(","));
      } else {
        searchParams.set(key, String(value));
      }
    }
  });

  const response = await fetch(`/api/projects?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  return response.json();
}

export function ProjectGrid() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["projects", "list"],
    queryFn: () => fetchProjects(),
  });

  if (isLoading) {
    return <ProjectGridSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Failed to load projects</h3>
        <p className="text-muted-foreground mb-4">
          There was an error loading the projects. Please try again.
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (!data?.projects?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No projects found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or check back later for new projects.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>

      {/* Pagination */}
      {data.pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            disabled={!data.pagination.hasPrev}
            onClick={() => {
              // Handle previous page
            }}
          >
            Previous
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from(
              { length: Math.min(5, data.pagination.pages) },
              (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={
                      data.pagination.page === page ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      // Handle page change
                    }}
                  >
                    {page}
                  </Button>
                );
              }
            )}
          </div>

          <Button
            variant="outline"
            disabled={!data.pagination.hasNext}
            onClick={() => {
              // Handle next page
            }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function ProjectGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-6 space-y-4">
          <Skeleton className="aspect-video w-full rounded" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
