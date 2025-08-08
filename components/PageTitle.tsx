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

  const currentTitle =
    pageMap[pathname] ||
    pathname
      .split("/")
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()) ||
    "Page";

  return (
    <span className="text-mb font-bold text-gray-900">{currentTitle}</span>
  );
}
