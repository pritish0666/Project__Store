"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const categories = [
  { id: "web-applications", name: "Web Applications", count: 156 },
  { id: "mobile-apps", name: "Mobile Apps", count: 89 },
  { id: "ai-ml", name: "AI/ML Projects", count: 67 },
  { id: "tools", name: "Developer Tools", count: 123 },
  { id: "games", name: "Games", count: 45 },
  { id: "data-viz", name: "Data Visualization", count: 34 },
];

const popularTags = [
  { id: "react", name: "React", count: 89 },
  { id: "nodejs", name: "Node.js", count: 67 },
  { id: "typescript", name: "TypeScript", count: 78 },
  { id: "python", name: "Python", count: 56 },
  { id: "ai", name: "AI/ML", count: 45 },
  { id: "mobile", name: "Mobile", count: 34 },
  { id: "web", name: "Web", count: 123 },
  { id: "tools", name: "Tools", count: 67 },
];

const statusOptions = [
  { id: "live", name: "Live", count: 234 },
  { id: "demo", name: "Demo", count: 89 },
  { id: "code", name: "Code Only", count: 156 },
];

export function ProjectFilters() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTags([]);
    setSelectedStatus(null);
    setMinRating(null);
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedCategory ||
    selectedTags.length > 0 ||
    selectedStatus ||
    minRating ||
    searchQuery;

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )
              }
              className={`w-full flex items-center justify-between p-2 rounded-md text-left transition-colors ${
                selectedCategory === category.id
                  ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                  : "hover:bg-muted"
              }`}
            >
              <span className="text-sm">{category.name}</span>
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {statusOptions.map((status) => (
            <button
              key={status.id}
              onClick={() =>
                setSelectedStatus(
                  selectedStatus === status.id ? null : status.id
                )
              }
              className={`w-full flex items-center justify-between p-2 rounded-md text-left transition-colors ${
                selectedStatus === status.id
                  ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                  : "hover:bg-muted"
              }`}
            >
              <span className="text-sm">{status.name}</span>
              <Badge variant="secondary" className="text-xs">
                {status.count}
              </Badge>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                  selectedTags.includes(tag.id)
                    ? "bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {tag.name}
                <Badge variant="outline" className="text-xs h-4 px-1">
                  {tag.count}
                </Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rating Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(minRating === rating ? null : rating)}
              className={`w-full flex items-center gap-2 p-2 rounded-md text-left transition-colors ${
                minRating === rating
                  ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                  : "hover:bg-muted"
              }`}
            >
              <span className="text-sm">{rating}+ stars</span>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
