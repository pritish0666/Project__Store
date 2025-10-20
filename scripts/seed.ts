import connectDB from "../src/lib/db";
import User from "../src/lib/models/User";
import Category from "../src/lib/models/Category";
import Tag from "../src/lib/models/Tag";
import Project from "../src/lib/models/Project";
import Review from "../src/lib/models/Review";

const sampleData = {
  categories: [
    {
      name: "Web Applications",
      slug: "web-applications",
      description: "Full-stack web applications and tools",
      color: "#ef4444",
    },
    {
      name: "Mobile Apps",
      slug: "mobile-apps",
      description: "iOS and Android mobile applications",
      color: "#3b82f6",
    },
    {
      name: "AI/ML Projects",
      slug: "ai-ml",
      description: "Artificial Intelligence and Machine Learning projects",
      color: "#10b981",
    },
    {
      name: "Developer Tools",
      slug: "tools",
      description: "Tools and utilities for developers",
      color: "#f59e0b",
    },
    {
      name: "Games",
      slug: "games",
      description: "Interactive games and entertainment",
      color: "#8b5cf6",
    },
    {
      name: "Data Visualization",
      slug: "data-viz",
      description: "Charts, dashboards, and data visualization tools",
      color: "#06b6d4",
    },
  ],

  tags: [
    { name: "React", slug: "react", color: "#61dafb" },
    { name: "Next.js", slug: "nextjs", color: "#000000" },
    { name: "Node.js", slug: "nodejs", color: "#339933" },
    { name: "TypeScript", slug: "typescript", color: "#3178c6" },
    { name: "JavaScript", slug: "javascript", color: "#f7df1e" },
    { name: "Python", slug: "python", color: "#3776ab" },
    { name: "MongoDB", slug: "mongodb", color: "#47a248" },
    { name: "PostgreSQL", slug: "postgresql", color: "#336791" },
    { name: "Tailwind CSS", slug: "tailwind", color: "#06b6d4" },
    { name: "Vue.js", slug: "vue", color: "#4fc08d" },
    { name: "Angular", slug: "angular", color: "#dd0031" },
    { name: "Express", slug: "express", color: "#000000" },
    { name: "Docker", slug: "docker", color: "#2496ed" },
    { name: "AWS", slug: "aws", color: "#ff9900" },
    { name: "Vercel", slug: "vercel", color: "#000000" },
    { name: "Firebase", slug: "firebase", color: "#ffca28" },
    { name: "AI/ML", slug: "ai-ml", color: "#ff6b6b" },
    { name: "Mobile", slug: "mobile", color: "#8b5cf6" },
    { name: "Web", slug: "web", color: "#3b82f6" },
    { name: "Tools", slug: "tools", color: "#f59e0b" },
  ],

  users: [
    {
      name: "Pritish Patra",
      email: "pritishpatra06@gmail.com",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      role: "admin",
      bio: "Full-stack developer passionate about creating amazing user experiences.",
      socialLinks: [
        { platform: "GitHub", url: "https://github.com/pritishpatra06" },
        { platform: "Twitter", url: "https://twitter.com/pritishpatra06" },
      ],
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      role: "user",
      bio: "Frontend developer specializing in React and modern web technologies.",
      socialLinks: [
        { platform: "GitHub", url: "https://github.com/janesmith" },
      ],
    },
    {
      name: "Mike Johnson",
      email: "mike@example.com",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      role: "user",
      bio: "Backend developer with expertise in Node.js and cloud technologies.",
      socialLinks: [],
    },
  ],

  projects: [
    {
      slug: "taskflow-pro",
      title: "TaskFlow Pro",
      tagline: "AI-powered project management tool",
      description:
        "A comprehensive project management application with AI-driven insights, team collaboration features, and advanced analytics. Built with modern web technologies for optimal performance and user experience. Features include real-time collaboration, smart task prioritization, and detailed reporting.",
      categoryId: "web-applications",
      tagIds: ["react", "nextjs", "nodejs", "mongodb", "ai-ml"],
      techStack: [
        "React",
        "Next.js",
        "Node.js",
        "MongoDB",
        "OpenAI API",
        "Tailwind CSS",
      ],
      repoUrl: "https://github.com/johndoe/taskflow-pro",
      demoUrl: "https://taskflow-pro.vercel.app",
      version: "2.1.0",
      status: "live",
      submittedBy: "pritishpatra06@gmail.com",
      heroImage:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
      screenshots: [
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      ],
      features: [
        "AI-powered task prioritization",
        "Real-time team collaboration",
        "Advanced analytics dashboard",
        "Mobile-responsive design",
        "Third-party integrations",
        "Custom workflow automation",
      ],
      changelog: [
        {
          version: "2.1.0",
          date: new Date("2024-01-15"),
          changes: [
            "Added AI task prioritization",
            "Improved mobile experience",
            "Fixed performance issues",
            "Added dark mode support",
          ],
        },
        {
          version: "2.0.0",
          date: new Date("2023-12-01"),
          changes: [
            "Complete UI redesign",
            "Added real-time collaboration",
            "Improved performance by 40%",
          ],
        },
      ],
    },
    {
      slug: "devtools-suite",
      title: "DevTools Suite",
      tagline: "Essential tools for developers",
      description:
        "A collection of productivity tools including code formatters, validators, and generators. Perfect for developers who want to streamline their workflow with powerful, easy-to-use tools.",
      categoryId: "tools",
      tagIds: ["typescript", "nodejs", "tools"],
      techStack: ["TypeScript", "Node.js", "Express", "Prisma", "PostgreSQL"],
      repoUrl: "https://github.com/janesmith/devtools-suite",
      demoUrl: "https://devtools-suite.vercel.app",
      version: "1.5.2",
      status: "live",
      submittedBy: "jane@example.com",
      heroImage:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
      screenshots: [
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
      ],
      features: [
        "Code formatter for multiple languages",
        "API endpoint validator",
        "Database schema generator",
        "CLI interface",
        "VS Code extension",
        "REST API documentation generator",
      ],
      changelog: [
        {
          version: "1.5.2",
          date: new Date("2024-01-10"),
          changes: [
            "Added Python support",
            "Fixed CLI bugs",
            "Improved performance",
          ],
        },
      ],
    },
    {
      slug: "data-viz-dashboard",
      title: "DataViz Dashboard",
      tagline: "Beautiful data visualization platform",
      description:
        "Create stunning interactive charts and dashboards with real-time data integration. Perfect for businesses and individuals who need to present data in an engaging and understandable way.",
      categoryId: "data-viz",
      tagIds: ["react", "typescript", "data-viz"],
      techStack: [
        "React",
        "TypeScript",
        "D3.js",
        "Python",
        "FastAPI",
        "PostgreSQL",
      ],
      repoUrl: "https://github.com/mikejohnson/data-viz-dashboard",
      demoUrl: "https://dataviz-dashboard.vercel.app",
      version: "3.0.1",
      status: "live",
      submittedBy: "mike@example.com",
      heroImage:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      screenshots: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      ],
      features: [
        "Interactive chart builder",
        "Real-time data integration",
        "Customizable themes",
        "Export to multiple formats",
        "Collaborative editing",
        "Advanced filtering options",
      ],
      changelog: [
        {
          version: "3.0.1",
          date: new Date("2024-01-20"),
          changes: [
            "Added new chart types",
            "Improved performance",
            "Fixed data loading issues",
          ],
        },
      ],
    },
    {
      slug: "mobile-fitness-tracker",
      title: "FitTracker Mobile",
      tagline: "Comprehensive fitness tracking app",
      description:
        "A mobile application for tracking workouts, nutrition, and health metrics. Features include workout planning, progress tracking, and social features for motivation.",
      categoryId: "mobile-apps",
      tagIds: ["mobile", "react", "nodejs"],
      techStack: ["React Native", "Node.js", "MongoDB", "Expo", "Redux"],
      repoUrl: "https://github.com/johndoe/fittracker-mobile",
      demoUrl: "https://fittracker-demo.vercel.app",
      version: "1.8.3",
      status: "live",
      submittedBy: "pritishpatra06@gmail.com",
      heroImage:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      screenshots: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&h=600&fit=crop",
      ],
      features: [
        "Workout tracking and planning",
        "Nutrition logging",
        "Progress analytics",
        "Social features",
        "Wearable device integration",
        "Offline support",
      ],
      changelog: [
        {
          version: "1.8.3",
          date: new Date("2024-01-12"),
          changes: [
            "Added Apple Watch support",
            "Improved UI/UX",
            "Fixed sync issues",
          ],
        },
      ],
    },
    {
      slug: "ai-chat-assistant",
      title: "AI Chat Assistant",
      tagline: "Intelligent conversational AI",
      description:
        "An advanced AI chat assistant powered by large language models. Features natural language processing, context awareness, and multi-language support.",
      categoryId: "ai-ml",
      tagIds: ["ai-ml", "python", "react"],
      techStack: [
        "Python",
        "FastAPI",
        "React",
        "OpenAI API",
        "Redis",
        "PostgreSQL",
      ],
      repoUrl: "https://github.com/janesmith/ai-chat-assistant",
      demoUrl: "https://ai-chat-demo.vercel.app",
      version: "1.2.0",
      status: "live",
      submittedBy: "jane@example.com",
      heroImage:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
      screenshots: [
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
      ],
      features: [
        "Natural language processing",
        "Context-aware conversations",
        "Multi-language support",
        "Voice input/output",
        "Custom model training",
        "API integration",
      ],
      changelog: [
        {
          version: "1.2.0",
          date: new Date("2024-01-18"),
          changes: [
            "Added voice support",
            "Improved response quality",
            "Added conversation history",
          ],
        },
      ],
    },
  ],

  reviews: [
    {
      projectSlug: "taskflow-pro",
      userEmail: "jane@example.com",
      rating: 5,
      body: "Absolutely love this tool! The AI features are game-changing and the interface is so intuitive. My team's productivity has increased significantly since we started using it.",
    },
    {
      projectSlug: "taskflow-pro",
      userEmail: "mike@example.com",
      rating: 4,
      body: "Great project management tool with excellent features. The AI prioritization is helpful, though it could use some improvements in the mobile app.",
    },
    {
      projectSlug: "devtools-suite",
      userEmail: "john@example.com",
      rating: 5,
      body: "Essential tools for any developer. The code formatter is particularly useful and saves me hours every week.",
    },
    {
      projectSlug: "data-viz-dashboard",
      userEmail: "jane@example.com",
      rating: 5,
      body: "Incredible visualization tool! The charts are beautiful and the real-time data integration works flawlessly. Highly recommended!",
    },
    {
      projectSlug: "mobile-fitness-tracker",
      userEmail: "mike@example.com",
      rating: 4,
      body: "Great fitness app with comprehensive tracking features. The social aspects really help with motivation. Would love to see more workout plans.",
    },
    {
      projectSlug: "ai-chat-assistant",
      userEmail: "john@example.com",
      rating: 5,
      body: "Impressive AI assistant with natural conversation flow. The voice features are a nice touch and the API is well-documented.",
    },
  ],
};

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...");

    await connectDB();

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await Promise.all([
      Review.deleteMany({}),
      Project.deleteMany({}),
      Tag.deleteMany({}),
      Category.deleteMany({}),
      User.deleteMany({}),
    ]);

    // Create categories
    console.log("📁 Creating categories...");
    const categories = await Category.insertMany(sampleData.categories);
    const categoryMap = new Map(categories.map((cat) => [cat.slug, cat._id]));

    // Create tags
    console.log("🏷️ Creating tags...");
    const tags = await Tag.insertMany(sampleData.tags);
    const tagMap = new Map(tags.map((tag) => [tag.slug, tag._id]));

    // Create users
    console.log("👥 Creating users...");
    const users = await User.insertMany(sampleData.users);
    const userMap = new Map(users.map((user) => [user.email, user._id]));

    // Create projects
    console.log("🚀 Creating projects...");
    const projects = await Promise.all(
      sampleData.projects.map(async (projectData) => {
        const submittedByUser = users.find(
          (u) => u.email === projectData.submittedBy
        );
        const project = new Project({
          ...projectData,
          categoryId: categoryMap.get(projectData.categoryId),
          tagIds: projectData.tagIds
            .map((tagSlug) => tagMap.get(tagSlug))
            .filter(Boolean),
          submittedBy: submittedByUser?._id,
          avgRating: 0,
          ratingsCount: 0,
          viewCount: Math.floor(Math.random() * 1000) + 100,
        });
        return project.save();
      })
    );
    const projectMap = new Map(
      projects.map((project) => [project.slug, project._id])
    );

    // Create reviews
    console.log("⭐ Creating reviews...");
    const reviews = await Promise.all(
      sampleData.reviews.map(async (reviewData) => {
        const project = projects.find((p) => p.slug === reviewData.projectSlug);
        const user = users.find((u) => u.email === reviewData.userEmail);

        if (!project || !user) return null;

        const review = new Review({
          projectId: project._id,
          userId: user._id,
          rating: reviewData.rating,
          body: reviewData.body,
          status: "approved",
        });

        return review.save();
      })
    );

    // Update project ratings
    console.log("📊 Updating project ratings...");
    for (const project of projects) {
      const projectReviews = reviews.filter(
        (r) => r && r.projectId.toString() === project._id.toString()
      );
      if (projectReviews.length > 0) {
        const avgRating =
          projectReviews.reduce((sum, r) => sum + r!.rating, 0) /
          projectReviews.length;
        await Project.findByIdAndUpdate(project._id, {
          avgRating: Math.round(avgRating * 10) / 10,
          ratingsCount: projectReviews.length,
        });
      }
    }

    console.log("✅ Database seeded successfully!");
    console.log(`📊 Created:`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${tags.length} tags`);
    console.log(`   - ${users.length} users`);
    console.log(`   - ${projects.length} projects`);
    console.log(`   - ${reviews.filter(Boolean).length} reviews`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
