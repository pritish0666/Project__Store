import { Suspense } from "react";
import { SignInForm } from "@/components/auth/signin-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded bg-red-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">PH</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold">Sign in to Project Hub</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Access your account to manage projects and reviews here at Project Hub where you can showcase your personal projects and get feedback from the community.
          </p>
        </div>

        <Suspense fallback={<SignInFormSkeleton />}>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}

function SignInFormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
