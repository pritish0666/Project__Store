import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";
import Category from "@/lib/models/Category";
import Tag from "@/lib/models/Tag";
import { projectFiltersSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const filters = {
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "12"),
      category: searchParams.get("category") || undefined,
      tags: searchParams.get("tags")?.split(",").filter(Boolean) || undefined,
      search: searchParams.get("search") || undefined,
      sort:
        (searchParams.get("sort") as "rating" | "recent" | "trending") ||
        "recent",
      status:
        (searchParams.get("status") as "live" | "demo" | "code") || undefined,
      minRating: searchParams.get("minRating")
        ? parseFloat(searchParams.get("minRating")!)
        : undefined,
    };

    // Validate filters
    const validatedFilters = projectFiltersSchema.parse(filters);

    // Build query
    const query: any = {
      status: "live", // Only show live projects to regular users
    };

    if (validatedFilters.category) {
      const category = await Category.findOne({
        slug: validatedFilters.category,
      });
      if (category) {
        query.categoryId = category._id;
      }
    }

    if (validatedFilters.tags && validatedFilters.tags.length > 0) {
      const tags = await Tag.find({ slug: { $in: validatedFilters.tags } });
      query.tagIds = { $in: tags.map((tag) => tag._id) };
    }

    // Status is always "live" for public API, so we don't need to check it

    if (validatedFilters.minRating) {
      query.avgRating = { $gte: validatedFilters.minRating };
    }

    // Build sort
    let sort: any = {};
    switch (validatedFilters.sort) {
      case "rating":
        sort = { avgRating: -1, ratingsCount: -1 };
        break;
      case "trending":
        sort = { viewCount: -1, avgRating: -1 };
        break;
      case "recent":
      default:
        sort = { updatedAt: -1 };
        break;
    }

    // Execute query
    const skip = (validatedFilters.page - 1) * validatedFilters.limit;

    let projectsQuery = Project.find(query)
      .populate("categoryId", "name slug color")
      .populate("tagIds", "name slug color")
      .sort(sort)
      .skip(skip)
      .limit(validatedFilters.limit);

    // Add text search if provided
    if (validatedFilters.search) {
      projectsQuery = Project.find({
        ...query,
        $text: { $search: validatedFilters.search },
      })
        .populate("categoryId", "name slug color")
        .populate("tagIds", "name slug color")
        .sort({ score: { $meta: "textScore" }, ...sort })
        .skip(skip)
        .limit(validatedFilters.limit);
    }

    const [projects, total] = await Promise.all([
      projectsQuery.exec(),
      Project.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / validatedFilters.limit);

    return NextResponse.json({
      projects,
      pagination: {
        page: validatedFilters.page,
        limit: validatedFilters.limit,
        total,
        pages: totalPages,
        hasNext: validatedFilters.page < totalPages,
        hasPrev: validatedFilters.page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
