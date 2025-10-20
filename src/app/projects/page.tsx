import { Suspense } from "react";
import { ProjectGrid } from "@/components/project/project-grid";
import { ProjectFilters } from "@/components/project/project-filters";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Projects</h1>
        <p className="text-muted-foreground">
          Discover amazing personal projects from developers around the world
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <ProjectFilters />
        </aside>

        {/* Projects Grid */}
        <main className="flex-1">
          <Suspense fallback={<ProjectGridSkeleton />}>
            <ProjectGrid />
          </Suspense>
        </main>
      </div>
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
