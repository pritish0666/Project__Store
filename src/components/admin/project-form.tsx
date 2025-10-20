"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Tag {
  _id: string;
  name: string;
  slug: string;
  color: string;
}

interface ProjectFormData {
  title: string;
  tagline: string;
  description: string;
  categoryId: string;
  tagIds: string[];
  techStack: string[];
  repoUrl: string;
  demoUrl: string;
  version: string;
  status: string;
  heroImage: string;
  screenshots: string[];
  features: string[];
}

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

async function fetchTags(): Promise<Tag[]> {
  const response = await fetch("/api/tags");
  if (!response.ok) {
    throw new Error("Failed to fetch tags");
  }
  return response.json();
}

async function fetchProject(id: string) {
  const response = await fetch(`/api/admin/projects/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }
  return response.json();
}

async function createProject(data: ProjectFormData) {
  const response = await fetch("/api/admin/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create project");
  }
  return response.json();
}

async function updateProject(id: string, data: ProjectFormData) {
  const response = await fetch(`/api/admin/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update project");
  }
  return response.json();
}

export function ProjectForm({ projectId }: { projectId?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!projectId;

  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    tagline: "",
    description: "",
    categoryId: "",
    tagIds: [],
    techStack: [],
    repoUrl: "",
    demoUrl: "",
    version: "1.0.0",
    status: "pending",
    heroImage: "",
    screenshots: [],
    features: [],
  });

  const [newTech, setNewTech] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [newScreenshot, setNewScreenshot] = useState("");

  // Fetch categories and tags
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  // Fetch project data if editing
  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId!),
    enabled: isEditing,
  });

  // Update form data when project is loaded
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        tagline: project.tagline || "",
        description: project.description || "",
        categoryId: project.categoryId?._id || "",
        tagIds: project.tagIds?.map((tag: any) => tag._id) || [],
        techStack: project.techStack || [],
        repoUrl: project.repoUrl || "",
        demoUrl: project.demoUrl || "",
        version: project.version || "1.0.0",
        status: project.status || "pending",
        heroImage: project.heroImage || "",
        screenshots: project.screenshots || [],
        features: project.features || [],
      });
    }
  }, [project]);

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
      router.push("/admin/projects");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProjectFormData) => updateProject(projectId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
      router.push("/admin/projects");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const addTech = () => {
    if (newTech && !formData.techStack.includes(newTech)) {
      setFormData({ ...formData, techStack: [...formData.techStack, newTech] });
      setNewTech("");
    }
  };

  const removeTech = (tech: string) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((t) => t !== tech),
    });
  };

  const addFeature = () => {
    if (newFeature && !formData.features.includes(newFeature)) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter((f) => f !== feature),
    });
  };

  const addScreenshot = () => {
    if (newScreenshot && !formData.screenshots.includes(newScreenshot)) {
      setFormData({
        ...formData,
        screenshots: [...formData.screenshots, newScreenshot],
      });
      setNewScreenshot("");
    }
  };

  const removeScreenshot = (screenshot: string) => {
    setFormData({
      ...formData,
      screenshots: formData.screenshots.filter((s) => s !== screenshot),
    });
  };

  const toggleTag = (tagId: string) => {
    setFormData({
      ...formData,
      tagIds: formData.tagIds.includes(tagId)
        ? formData.tagIds.filter((id) => id !== tagId)
        : [...formData.tagIds, tagId],
    });
  };

  if (!categories || !tags) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" asChild>
            <Link href="/admin/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Edit Project" : "Create New Project"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tagline</label>
              <Input
                value={formData.tagline}
                onChange={(e) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-3 border rounded-md min-h-[120px]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="w-full p-3 border rounded-md"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full p-3 border rounded-md"
                >
                  <option value="pending">Pending</option>
                  <option value="live">Live</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag._id}
                  variant={
                    formData.tagIds.includes(tag._id) ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag._id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle>Tech Stack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="Add technology"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTech())
                }
              />
              <Button type="button" onClick={addTech}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.techStack.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tech}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTech(tech)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* URLs */}
        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Repository URL
              </label>
              <Input
                value={formData.repoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, repoUrl: e.target.value })
                }
                type="url"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Demo URL</label>
              <Input
                value={formData.demoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, demoUrl: e.target.value })
                }
                type="url"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Version</label>
              <Input
                value={formData.version}
                onChange={(e) =>
                  setFormData({ ...formData, version: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add feature"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addFeature())
                }
              />
              <Button type="button" onClick={addFeature}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ul className="space-y-2">
              {formData.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="flex-1">{feature}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(feature)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Hero Image URL
              </label>
              <Input
                value={formData.heroImage}
                onChange={(e) =>
                  setFormData({ ...formData, heroImage: e.target.value })
                }
                type="url"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Screenshots
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newScreenshot}
                  onChange={(e) => setNewScreenshot(e.target.value)}
                  placeholder="Add screenshot URL"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addScreenshot())
                  }
                />
                <Button type="button" onClick={addScreenshot}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.screenshots.map((screenshot, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 text-sm">{screenshot}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeScreenshot(screenshot)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/projects">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {isEditing ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </form>
    </div>
  );
}
