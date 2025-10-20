import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AdminUsersPage } from "@/components/admin/admin-users-page";

export default function AdminUsersPageRoute() {
  return (
    <div>
      <AdminNavigation />
      <AdminUsersPage />
    </div>
  );
}
