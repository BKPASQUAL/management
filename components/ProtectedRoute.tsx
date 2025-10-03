"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserRole } from "@/store/services/auth";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

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

  useEffect(() => {
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
  }, [isAuthenticated, user, allowedRoles, requireAuth, router, pathname]);

  // Show loading state while checking authentication
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading...</p>
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
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
          <p className="text-xl text-gray-600 mb-4">Access Denied</p>
          <p className="text-gray-500 mb-8">
            You don&apos;t have permission to access this page.
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}