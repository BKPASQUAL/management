"use client"

import React, { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar-rep";
import { PageTitle } from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { CartProvider, useCart } from "@/components/representative/CartProvider";
import CartSidebar from "@/components/representative/CartSidebar";

const user = {
  name: "John Doe",
  role: "Administrator",
};

// Cart Icon Component
function CartIcon() {
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2 hover:bg-gray-100"
        onClick={() => setIsCartOpen(true)}
      >
        <ShoppingCart className="h-5 w-5 text-gray-700" />
        {cartCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {cartCount > 99 ? "99+" : cartCount}
          </Badge>
        )}
      </Button>

      <CartSidebar open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
}

// Main Layout Component
function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="" suppressHydrationWarning={true}>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1">
            <div className="sticky top-0 z-50 flex items-center justify-between p-2 h-14 border-b bg-white backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="text-black" />
                <PageTitle />
              </div>

              <div className="flex items-center space-x-4">
                {/* Cart Icon */}
                <CartIcon />

                {/* User Profile */}
                <div className="flex items-center space-x-3 mr-4">
                  <div className="text-right hidden sm:block">
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
            <div className="p-4">{children}</div>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}

// Root Layout with Cart Provider
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <LayoutContent>{children}</LayoutContent>
    </CartProvider>
  );
}
