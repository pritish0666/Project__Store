import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Query Keys
export const queryKeys = {
  projects: {
    all: ["projects"],
    lists: () => [...queryKeys.projects.all, "list"],
    list: (filters: any) => [...queryKeys.projects.lists(), { filters }],
    details: () => [...queryKeys.projects.all, "detail"],
    detail: (slug: string) => [...queryKeys.projects.details(), slug],
  },
  reviews: {
    all: ["reviews"],
    lists: () => [...queryKeys.reviews.all, "list"],
    list: (projectId: string) => [...queryKeys.reviews.lists(), projectId],
  },
  user: {
    all: ["user"],
    profile: () => [...queryKeys.user.all, "profile"],
    bookmarks: () => [...queryKeys.user.all, "bookmarks"],
  },
  categories: {
    all: ["categories"],
  },
  tags: {
    all: ["tags"],
  },
  collections: {
    all: ["collections"],
    lists: () => [...queryKeys.collections.all, "list"],
    list: (slug: string) => [...queryKeys.collections.lists(), slug],
  },
};
