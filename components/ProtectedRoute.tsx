"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserRole } from "@/store/services/auth";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  requireAuth = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by only rendering auth-dependent UI on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Check if authentication is required and user is not authenticated
    if (requireAuth && !isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    // Check if user has required role
    if (
      requireAuth &&
      isAuthenticated &&
      user &&
      allowedRoles &&
      allowedRoles.length > 0
    ) {
      if (!allowedRoles.includes(user.role)) {
        // Redirect to unauthorized page or appropriate dashboard
        router.push("/unauthorized");
      }
    }
  }, [
    isClient,
    isAuthenticated,
    user,
    allowedRoles,
    requireAuth,
    router,
    pathname,
  ]);

  // Show nothing during SSR to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  // Show loading state while checking authentication (client-side only)
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized message if role doesn't match
  if (
    requireAuth &&
    isAuthenticated &&
    user &&
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <h1 className="text-4xl font-bold">403</h1>
          <p className="text-xl font-semibold">Access Denied</p>
          <p className="text-sm text-muted-foreground">
            You don&apos;t have permission to access this page.
          </p>
          <Button onClick={() => router.back()} variant="default">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
