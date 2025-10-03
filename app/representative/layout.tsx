"use client";

import { AppSidebar } from "@/components/app-sidebar-rep";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { Store } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function PageTitle() {
  const pathname = usePathname();

  const getTitleFromPath = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";

    const lastSegment = segments[segments.length - 1];
    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="flex items-center space-x-2">
      <Store className="h-6 w-6 text-primary" />
      <h1 className="text-lg font-semibold">{getTitleFromPath(pathname)}</h1>
    </div>
  );
}

function UserMenu() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-3 mr-4 focus:outline-none">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-gray-900">
              {user?.username || "User"}
            </div>
            <div className="text-xs text-gray-400 capitalize">
              {user?.role || "Representative"}
            </div>
          </div>
          <Avatar className="cursor-pointer">
            <AvatarFallback className="bg-primary text-white">
              {getInitials(user?.username)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/representative/profile")}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/representative/settings")}
        >
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="sticky top-0 z-50 flex items-center justify-between p-2 h-14 border-b bg-white backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="text-black" />
            <PageTitle />
          </div>

          <UserMenu />
        </div>
        <div className="p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["representative"]}>
      <LayoutContent>{children}</LayoutContent>
    </ProtectedRoute>
  );
}
