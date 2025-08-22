import React from "react";
import { Geist, Geist_Mono } from "next/font/google";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { PageTitle } from "@/components/PageTitle";
// import { Button } from "@/components/ui/button";
// import { PageBreadcrumb } from "@/components/page-breadcrumb";

const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

const user = {
  name: "John Doe",
  role: "Administrator",
};

export default function layout() {
  return (
    <div>
      <body className={`${geistSans.className} ${geistMono.className}`}>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1">
            <div className="sticky top-0 z-50 flex items-center justify-between p-2 h-14 border-b bg-white backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="text-black" />
                {/* Current Page Location */}
                <PageTitle />
              </div>
              <div className="flex items-center space-x-20">
                {/* <Button variant="outline">Create Bill</Button> */}

                {/* User Info Section */}
                <div className="flex items-center space-x-3 mr-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-400">{user.role}</div>
                  </div>

                  {/* Optional: Add user avatar */}
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
            <div className="p-4 h-[40%]"></div>
          </main>
        </SidebarProvider>
      </body>
    </div>
  );
}
