import { Suspense } from "react";
import { UserProjectSubmissionForm } from "@/components/user/project-submission-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewProjectPage() {
  return (
    <div>
      <Suspense fallback={<ProjectFormSkeleton />}>
        <UserProjectSubmissionForm />
      </Suspense>
    </div>
  );
}

function ProjectFormSkeleton() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="space-y-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-6 border rounded-lg space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
