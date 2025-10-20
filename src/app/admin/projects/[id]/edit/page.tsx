import { AdminNavigation } from "@/components/admin/admin-navigation";
import { ProjectForm } from "@/components/admin/project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <AdminNavigation />
      <ProjectForm projectId={id} />
    </div>
  );
}
