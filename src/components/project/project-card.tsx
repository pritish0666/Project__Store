import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { ExternalLink, Github, Eye } from "lucide-react";
import { formatRelativeTime, getTechStackColor } from "@/lib/utils";

interface Project {
  _id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  heroImage: string;
  avgRating: number;
  ratingsCount: number;
  availability: "live" | "demo" | "code"; // Project availability status
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
  demoUrl?: string;
  repoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="aspect-video overflow-hidden">
        <Link href={`/projects/${project.slug}`}>
          <Image
            src={project.heroImage}
            alt={project.title}
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      <CardHeader className="pb-3">
        {/* Category and Status */}
        <div className="flex items-center justify-between mb-2">
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
            {project.availability}
          </Badge>
        </div>

        {/* Title */}
        <CardTitle className="group-hover:text-red-500 transition-colors line-clamp-1">
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </CardTitle>

        {/* Tagline */}
        <p className="text-sm text-muted-foreground line-clamp-1">
          {project.tagline}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <Rating rating={project.avgRating} showText size="sm" />
          <span className="text-xs text-muted-foreground">
            {project.ratingsCount} reviews
          </span>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1">
          {project.techStack.slice(0, 3).map((tech, index) => (
            <Badge
              key={index}
              variant="outline"
              style={{
                color: getTechStackColor(tech),
                borderColor: getTechStackColor(tech) + "40",
              }}
              className="text-xs"
            >
              {tech}
            </Badge>
          ))}
          {project.techStack.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.techStack.length - 3}
            </Badge>
          )}
        </div>

        {/* Tags */}
        {project.tagIds.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tagIds.slice(0, 2).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                style={{
                  backgroundColor: tag.color + "20",
                  color: tag.color,
                }}
                className="text-xs"
              >
                {tag.name}
              </Badge>
            ))}
            {project.tagIds.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{project.tagIds.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button asChild className="flex-1">
            <Link href={`/projects/${project.slug}`}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>

          {project.demoUrl && project.availability === "live" && (
            <Button variant="outline" size="icon" asChild>
              <Link
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          )}

          {project.repoUrl && (
            <Button variant="outline" size="icon" asChild>
              <Link
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Updated time */}
        <p className="text-xs text-muted-foreground">
          Updated {formatRelativeTime(project.updatedAt)}
        </p>
      </CardContent>
    </Card>
  );
}
