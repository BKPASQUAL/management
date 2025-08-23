import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { PageTitle } from "@/components/PageTitle";
import { CartProvider } from "@/components/representative/CartProvider";

const user = {
  name: "John Doe",
  role: "Administrator",
};

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
          <div className="flex items-center space-x-20">
            <div className="flex items-center space-x-3 mr-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {user.name}
                </div>
                <div className="text-xs text-gray-400">{user.role}</div>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-800">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 h-[40%]">{children}</div>
      </main>
    </SidebarProvider>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <LayoutContent>{children}</LayoutContent>
    </CartProvider>
  );
}
