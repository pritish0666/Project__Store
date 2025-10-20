import { Suspense } from "react";
import { UserDashboard } from "@/components/user/user-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDashboardPage() {
  return (
    <div>
      <Suspense fallback={<UserDashboardSkeleton />}>
        <UserDashboard />
      </Suspense>
    </div>
  );
}

function UserDashboardSkeleton() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-6 border rounded-lg">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
