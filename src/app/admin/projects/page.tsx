import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AdminProjectsPage } from "@/components/admin/admin-projects-page";

export default function AdminProjectsPageRoute() {
  return (
    <div>
      <AdminNavigation />
      <AdminProjectsPage />
    </div>
  );
}
