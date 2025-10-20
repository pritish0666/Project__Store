import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function Rating({
  rating,
  maxRating = 5,
  size = "md",
  showText = false,
  className,
}: RatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: fullStars }, (_, i) => (
          <Star
            key={i}
            className={cn("fill-yellow-400 text-yellow-400", sizeClasses[size])}
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className={cn("text-gray-300", sizeClasses[size])} />
            <Star
              className={cn(
                "absolute inset-0 fill-yellow-400 text-yellow-400 overflow-hidden",
                sizeClasses[size]
              )}
              style={{ width: "50%" }}
            />
          </div>
        )}
        {Array.from({ length: emptyStars }, (_, i) => (
          <Star
            key={i + fullStars + (hasHalfStar ? 1 : 0)}
            className={cn("text-gray-300", sizeClasses[size])}
          />
        ))}
      </div>
      {showText && (
        <span className="text-sm text-muted-foreground ml-1">
          {rating.toFixed(1)} ({maxRating})
        </span>
      )}
    </div>
  );
}

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RatingInput({
  value,
  onChange,
  maxRating = 5,
  size = "md",
  className,
}: RatingInputProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
        >
          <Star
            className={cn(
              "transition-colors",
              i < value
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 hover:text-yellow-400",
              sizeClasses[size]
            )}
          />
        </button>
      ))}
    </div>
  );
}
