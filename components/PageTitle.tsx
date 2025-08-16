"use client";

import { usePathname } from "next/navigation";

export function PageTitle() {
  const pathname = usePathname();

  const pageMap: { [key: string]: string } = {
    "/dashboard": "Dashboard",
    "/products": "Products",
    "/users": "Users",
    "/analytics": "Analytics",
    "/settings": "Settings",
  };

  // Handle dynamic routes
  const getDynamicTitle = (path: string): string | null => {
    // Check if it's a product detail page
    if (path.startsWith("/products/productDetail/")) {
      return "Product Details";
    } else if (path.startsWith("/suppliers/supplierDetail/")) {
      return "Product Details";
    }

    // Add more dynamic route patterns here if needed
    // Example: if (path.startsWith("/users/profile/")) {
    //   return "User Profile";
    // }

    return null;
  };

  const currentTitle =
    pageMap[pathname] ||
    getDynamicTitle(pathname) ||
    pathname
      .split("/")
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()) ||
    "Page";

  return (
    <span className="text-lg font-bold text-gray-900">{currentTitle}</span>
  );
}
