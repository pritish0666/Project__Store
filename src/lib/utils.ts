import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string) {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - targetDate.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    return formatDate(date);
  }
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function calculateWilsonScore(
  positive: number,
  total: number,
  confidence = 0.95
): number {
  if (total === 0) return 0;

  const z = 1.96; // 95% confidence
  const p = positive / total;
  const n = total;

  return (
    (p +
      (z * z) / (2 * n) -
      z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n)) /
    (1 + (z * z) / n)
  );
}

export function isSpamReview(
  review: { body: string },
  user: {
    recentReviews?: number;
    createdAt: Date;
    bio?: string;
    socialLinks?: any[];
  }
): boolean {
  const spamIndicators = {
    // Rate limiting
    recentReviews: (user.recentReviews || 0) > 5,

    // Content analysis
    excessiveCaps:
      (review.body.match(/[A-Z]/g) || []).length / review.body.length > 0.3,
    excessivePunctuation: (review.body.match(/[!]{2,}/g) || []).length > 2,
    suspiciousPatterns: /(buy|sell|click|free|money|win|prize)/i.test(
      review.body
    ),

    // User behavior
    newAccount:
      new Date(user.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000),
    noProfile:
      !user.bio && (!user.socialLinks || user.socialLinks.length === 0),
  };

  const spamScore = Object.values(spamIndicators).filter(Boolean).length;
  return spamScore >= 2;
}

export function rankReviews(
  reviews: any[],
  sortBy: "recent" | "helpful" | "rating" = "recent"
) {
  switch (sortBy) {
    case "helpful":
      return reviews.sort((a, b) => {
        const aScore = calculateWilsonScore(
          a.helpfulVotes.length,
          a.helpfulVotes.length + a.abuseReports.length
        );
        const bScore = calculateWilsonScore(
          b.helpfulVotes.length,
          b.helpfulVotes.length + b.abuseReports.length
        );
        return bScore - aScore;
      });

    case "rating":
      return reviews.sort((a, b) => b.rating - a.rating);

    case "recent":
    default:
      return reviews.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

export function trackEvent(type: string, payload: Record<string, any> = {}) {
  if (typeof window !== "undefined") {
    fetch("/api/analytics/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        payload,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
      }),
    }).catch(console.error);
  }
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getTechStackColor(tech: string): string {
  const colors: Record<string, string> = {
    React: "#61dafb",
    "Next.js": "#000000",
    "Node.js": "#339933",
    TypeScript: "#3178c6",
    JavaScript: "#f7df1e",
    Python: "#3776ab",
    MongoDB: "#47a248",
    PostgreSQL: "#336791",
    "Tailwind CSS": "#06b6d4",
    "Vue.js": "#4fc08d",
    Angular: "#dd0031",
    Express: "#000000",
    Docker: "#2496ed",
    AWS: "#ff9900",
    Vercel: "#000000",
    Firebase: "#ffca28",
  };

  return colors[tech] || "#6b7280";
}
