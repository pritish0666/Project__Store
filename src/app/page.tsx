import Link from "next/link";
import Image from "next/image";
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
import { ArrowRight, Star, Tag, Folder, Code } from "lucide-react";
import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";
import Category from "@/lib/models/Category";
import TagModel from "@/lib/models/Tag";

// Mock data for featured projects (kept for now; real list is shown on /projects)
const featuredProjects = [
  {
    id: "1",
    slug: "taskflow-pro",
    title: "TaskFlow Pro",
    tagline: "AI-powered project management tool",
    description:
      "A comprehensive project management application with AI-driven insights and team collaboration features.",
    heroImage:
      "https://imgs.search.brave.com/GG3BEkpWHIkmdM_CXdjUqikwHMMzIASAcLpGVBd_X_Y/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTk3/NjA5OTY2NC9waG90/by9hcnRpZmljaWFs/LWludGVsbGlnZW5j/ZS1wcm9jZXNzb3It/Y29uY2VwdC1haS1i/aWctZGF0YS1hcnJh/eS5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9clR0V1A5eXd4/Wk1fQnlnelVSaWtk/b1dSSG5PNG9oRDcz/Wi1SREFnX3U4TT0",
    avgRating: 4.8,
    ratingsCount: 124,
    category: { name: "Web Applications", color: "#ef4444" },
    tags: [
      { name: "React", color: "#61dafb" },
      { name: "AI/ML", color: "#ff6b6b" },
      { name: "Node.js", color: "#339933" },
    ],
    status: "live",
    demoUrl: "#",
  },
  {
    id: "2",
    slug: "devtools-suite",
    title: "DevTools Suite",
    tagline: "Essential tools for developers",
    description:
      "A collection of productivity tools including code formatters, validators, and generators.",
    heroImage:
      "https://imgs.search.brave.com/nKLl_lgQWYshrGpQ__qjBLTb9aqxQNb-RMaFht3_eWc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9w/ZXJzb24td2Vhcmlu/Zy1oaWdoLXRlY2gt/dnItZ2xhc3Nlcy13/aGlsZS1zdXJyb3Vu/ZGVkLWJ5LWJyaWdo/dC1ibHVlLW5lb24t/Y29sb3JzXzIzLTIx/NTEyNTUxMjkuanBn/P3NlbXQ9YWlzX2h5/YnJpZCZ3PTc0MCZx/PTgw",
    avgRating: 4.6,
    ratingsCount: 89,
    category: { name: "Developer Tools", color: "#3b82f6" },
    tags: [
      { name: "TypeScript", color: "#3178c6" },
      { name: "CLI", color: "#6b7280" },
    ],
    status: "live",
    demoUrl: "#",
  },
  {
    id: "3",
    slug: "data-viz-dashboard",
    title: "DataViz Dashboard",
    tagline: "Beautiful data visualization platform",
    description:
      "Create stunning interactive charts and dashboards with real-time data integration.",
    heroImage:
      "https://imgs.search.brave.com/4-C5b0_ZU7sx7vJaTZxdc7ZvInOr-0E8BaWpXMLVDuw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjE1/NTc2OTU1NS9waG90/by9hcnRpZmljaWFs/LWludGVsbGlnZW5j/ZS1jb25jZXB0LWNw/dS1xdWFudHVtLWNv/bXB1dGluZy5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9WXR4/RnVkc01YOVpDVmpk/Yml4ZERFTTRjSjV4/b3RNbjVnNWdnR0Jl/amdmcz0",
    avgRating: 4.9,
    ratingsCount: 156,
    category: { name: "Data Visualization", color: "#10b981" },
    tags: [
      { name: "D3.js", color: "#f9a03f" },
      { name: "React", color: "#61dafb" },
      { name: "Python", color: "#3776ab" },
    ],
    status: "live",
    demoUrl: "#",
  },
];

export default async function HomePage() {
  // Query database directly on the server for hero stats
  await connectDB();
  const [projectsTotal, categoriesTotal, tagsTotal] = await Promise.all([
    Project.countDocuments({ status: "live" }),
    Category.countDocuments({}),
    TagModel.countDocuments({}),
  ]);

  const stats = [
    { label: "Projects", value: projectsTotal.toLocaleString(), icon: Code },
    {
      label: "Categories",
      value: categoriesTotal.toLocaleString(),
      icon: Folder,
    },
    { label: "Tags", value: tagsTotal.toLocaleString(), icon: Tag },
    { label: "Reviews", value: "Live", icon: Star },
  ];
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-red-50 via-orange-50 to-white dark:from-red-950/20 dark:via-orange-950/10 dark:to-background" />
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm ring-1 ring-red-200 text-blue-700 dark:bg-red-900/20 dark:text-red-200 dark:ring-red-800 text-xs font-semibold mb-5">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
            <p className="text-sm text-red-700">
              Built by developers, for developers
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Showcase Your
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500">
              {" "}
              Personal Projects
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover, rate, and review amazing personal projects. A Play
            Store-like experience for developers to showcase their work and get
            feedback from the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="shadow-md hover:shadow-xl" asChild>
              <Link href="/projects">
                Browse Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="shadow-sm hover:shadow-lg border-2"
              asChild
            >
              <Link href="/profile/projects/new">Submit Project</Link>
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
                  <Image
                    src={project.heroImage}
                    alt={project.title}
                    width={800}
                    height={600}
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
      <section className="py-28 px-4 bg-red-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Showcase Your Project?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers sharing their amazing work
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="shadow-lg hover:shadow-xl font-semibold border-2 border-white/80"
            asChild
          >
            <Link href="/profile/projects/new">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
