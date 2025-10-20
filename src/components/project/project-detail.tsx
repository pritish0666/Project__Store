"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import {
  ExternalLink,
  Github,
  Calendar,
  Tag,
  Code,
  Star,
  Users,
  Eye,
} from "lucide-react";
import { formatRelativeTime, getTechStackColor } from "@/lib/utils";

interface Project {
  _id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  heroImage: string;
  screenshots: string[];
  avgRating: number;
  ratingsCount: number;
  viewCount: number;
  status: "live" | "demo" | "code";
  version: string;
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
  features: string[];
  changelog: Array<{
    version: string;
    date: string;
    changes: string[];
  }>;
  demoUrl?: string;
  repoUrl?: string;
  createdAt: string;
  updatedAt: string;
  reviews: Array<{
    _id: string;
    rating: number;
    body: string;
    userId: {
      name: string;
      image?: string;
    };
    createdAt: string;
  }>;
  similarProjects: Project[];
}

async function fetchProject(slug: string): Promise<Project> {
  const response = await fetch(`/api/projects/${slug}`);
  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error("Failed to fetch project");
  }
  return response.json();
}

export function ProjectDetail({ slug }: { slug: string }) {
  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects", "detail", slug],
    queryFn: () => fetchProject(slug),
  });

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (error || !project) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="secondary"
                style={{
                  backgroundColor: project.categoryId.color + "20",
                  color: project.categoryId.color,
                }}
              >
                {project.categoryId.name}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {project.status}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold">{project.title}</h1>
            <p className="text-xl text-muted-foreground">{project.tagline}</p>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {project.viewCount.toLocaleString()} views
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Updated {formatRelativeTime(project.updatedAt)}
              </div>
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />v{project.version}
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="aspect-video overflow-hidden rounded-lg">
            <Image
              src={project.heroImage}
              alt={project.title}
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">About this project</h2>
            <p className="text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Features */}
          {project.features.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Screenshots */}
          {project.screenshots.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.screenshots.map((screenshot, index) => (
                  <div
                    key={index}
                    className="aspect-video overflow-hidden rounded-lg"
                  >
                    <Image
                      src={screenshot}
                      alt={`${project.title} screenshot ${index + 1}`}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Changelog */}
          {project.changelog.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Changelog</h2>
              <div className="space-y-4">
                {project.changelog.map((entry, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          v{entry.version}
                        </CardTitle>
                        <span className="text-sm text-muted-foreground">
                          {formatRelativeTime(entry.date)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {entry.changes.map((change, changeIndex) => (
                          <li
                            key={changeIndex}
                            className="flex items-start gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {change}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {project.reviews.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Reviews</h2>
              <div className="space-y-4">
                {project.reviews.slice(0, 5).map((review) => (
                  <Card key={review._id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {review.userId.name}
                            </span>
                            <Rating rating={review.rating} size="sm" />
                            <span className="text-sm text-muted-foreground">
                              {formatRelativeTime(review.createdAt)}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{review.body}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rating */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Rating
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold">{project.avgRating}</div>
                <Rating rating={project.avgRating} size="lg" />
                <p className="text-sm text-muted-foreground mt-2">
                  Based on {project.ratingsCount} reviews
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.demoUrl && project.status === "live" && (
                <Button asChild className="w-full">
                  <Link
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </Link>
                </Button>
              )}

              {project.repoUrl && (
                <Button variant="outline" asChild className="w-full">
                  <Link
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    View Source
                  </Link>
                </Button>
              )}

              <Button variant="outline" className="w-full">
                <Star className="h-4 w-4 mr-2" />
                Write Review
              </Button>
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Tech Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    style={{
                      color: getTechStackColor(tech),
                      borderColor: getTechStackColor(tech) + "40",
                    }}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tagIds.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    style={{
                      backgroundColor: tag.color + "20",
                      color: tag.color,
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Similar Projects */}
          {project.similarProjects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Similar Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.similarProjects.map((similarProject) => (
                  <Link
                    key={similarProject._id}
                    href={`/projects/${similarProject.slug}`}
                    className="block p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                        <Code className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">
                          {similarProject.title}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {similarProject.tagline}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Rating rating={similarProject.avgRating} size="sm" />
                          <span className="text-xs text-muted-foreground">
                            {similarProject.ratingsCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectDetailSkeleton() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="aspect-video w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  );
}
