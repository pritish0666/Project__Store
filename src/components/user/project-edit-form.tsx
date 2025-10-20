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
import { useSession } from "next-auth/react";

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
  const response = await fetch(`/api/user/projects/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }
  return response.json();
}

async function updateProject(id: string, data: ProjectFormData) {
  const response = await fetch(`/api/user/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update project");
  }
  return response.json();
}

export function UserProjectEditForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

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
    heroImage: "",
    screenshots: [],
    features: [],
  });

  const [newTech, setNewTech] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [newScreenshot, setNewScreenshot] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, router]);

  // Fetch categories and tags
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  // Fetch project data
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["user", "project", projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
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
        heroImage: project.heroImage || "",
        screenshots: project.screenshots || [],
        features: project.features || [],
      });
    }
  }, [project]);

  const updateMutation = useMutation({
    mutationFn: (data: ProjectFormData) => updateProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "projects"] });
      router.push("/profile/projects");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
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

  if (!session) {
    return <div>Redirecting to sign in...</div>;
  }

  if (projectLoading) {
    return <div>Loading project...</div>;
  }

  if (!categories || !tags) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" asChild>
            <Link href="/profile/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Projects
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Project</h1>
        </div>
        <p className="text-muted-foreground">
          Update your project details. After saving, it will be sent back for
          review.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter your project title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Tagline *
              </label>
              <Input
                value={formData.tagline}
                onChange={(e) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                placeholder="A short description of your project"
                maxLength={100}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-3 border rounded-md min-h-[120px]"
                placeholder="Describe your project in detail..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
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
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Technologies & Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Tags
              </label>
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
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tech Stack
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="Add technology (e.g., React, Node.js)"
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
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        <Card>
          <CardHeader>
            <CardTitle>Project Links</CardTitle>
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
                placeholder="https://github.com/username/project"
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
                placeholder="https://your-project.vercel.app"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Version</label>
              <Input
                value={formData.version}
                onChange={(e) =>
                  setFormData({ ...formData, version: e.target.value })
                }
                placeholder="1.0.0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a key feature"
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
            <CardTitle>Project Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Hero Image URL *
              </label>
              <Input
                value={formData.heroImage}
                onChange={(e) =>
                  setFormData({ ...formData, heroImage: e.target.value })
                }
                type="url"
                placeholder="https://example.com/hero-image.jpg"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                This will be the main image displayed for your project
              </p>
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
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Save Changes</h3>
              <p className="text-muted-foreground mb-4">
                Your project will be sent back for review after saving changes.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link href="/profile/projects">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
