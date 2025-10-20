import { Suspense } from "react";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPage() {
  return (
    <div>
      <AdminNavigation />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage projects, reviews, and analytics
          </p>
        </div>

        <Suspense fallback={<AdminDashboardSkeleton />}>
          <AdminDashboard />
        </Suspense>
      </div>
    </div>
  );
}

function AdminDashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-6 border rounded-lg">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}
