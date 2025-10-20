import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { ArrowRight, Star, TrendingUp, Users, Code } from "lucide-react";

// Mock data for featured projects
const featuredProjects = [
  {
    id: "1",
    slug: "taskflow-pro",
    title: "TaskFlow Pro",
    tagline: "AI-powered project management tool",
    description:
      "A comprehensive project management application with AI-driven insights and team collaboration features.",
    heroImage: "/api/placeholder/400/300",
    avgRating: 4.8,
    ratingsCount: 124,
    category: { name: "Web Applications", color: "#ef4444" },
    tags: [
      { name: "React", color: "#61dafb" },
      { name: "AI/ML", color: "#ff6b6b" },
      { name: "Node.js", color: "#339933" },
    ],
    status: "live",
  },
  {
    id: "2",
    slug: "devtools-suite",
    title: "DevTools Suite",
    tagline: "Essential tools for developers",
    description:
      "A collection of productivity tools including code formatters, validators, and generators.",
    heroImage: "/api/placeholder/400/300",
    avgRating: 4.6,
    ratingsCount: 89,
    category: { name: "Developer Tools", color: "#3b82f6" },
    tags: [
      { name: "TypeScript", color: "#3178c6" },
      { name: "CLI", color: "#6b7280" },
    ],
    status: "live",
  },
  {
    id: "3",
    slug: "data-viz-dashboard",
    title: "DataViz Dashboard",
    tagline: "Beautiful data visualization platform",
    description:
      "Create stunning interactive charts and dashboards with real-time data integration.",
    heroImage: "/api/placeholder/400/300",
    avgRating: 4.9,
    ratingsCount: 156,
    category: { name: "Data Visualization", color: "#10b981" },
    tags: [
      { name: "D3.js", color: "#f9a03f" },
      { name: "React", color: "#61dafb" },
      { name: "Python", color: "#3776ab" },
    ],
    status: "live",
  },
];

const stats = [
  { label: "Projects", value: "500+", icon: Code },
  { label: "Reviews", value: "2.5K+", icon: Star },
  { label: "Users", value: "1.2K+", icon: Users },
  { label: "Growth", value: "+25%", icon: TrendingUp },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Showcase Your
            <span className="text-red-500"> Personal Projects</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover, rate, and review amazing personal projects. A Play
            Store-like experience for developers to showcase their work and get
            feedback from the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/projects">
                Browse Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/projects/new">Submit Project</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                  <stat.icon className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
            <p className="text-xl text-muted-foreground">
              Discover some of the most popular and highly-rated projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Card
                key={project.id}
                className="group hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={project.heroImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: project.category.color + "20",
                        color: project.category.color,
                      }}
                    >
                      {project.category.name}
                    </Badge>
                    <Badge variant="outline">{project.status}</Badge>
                  </div>
                  <CardTitle className="group-hover:text-red-500 transition-colors">
                    <Link href={`/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{project.tagline}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <Rating rating={project.avgRating} showText size="sm" />
                    <span className="text-sm text-muted-foreground">
                      {project.ratingsCount} reviews
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        style={{
                          color: tag.color,
                          borderColor: tag.color + "40",
                        }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="outline">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={`/projects/${project.slug}`}>
                        View Details
                      </Link>
                    </Button>
                    {project.status === "live" && (
                      <Button variant="outline" asChild>
                        <Link href={project.demoUrl || "#"} target="_blank">
                          Live Demo
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/projects">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-red-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Showcase Your Project?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers sharing their amazing work
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/projects/new">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
