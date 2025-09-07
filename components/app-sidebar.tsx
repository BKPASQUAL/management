"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Home,
  Package,
  Users,
  LogOut,
  Store,
  Settings,
  BarChart3,
  Truck,
  FileText,
  Receipt,
  UserCheck,
  ShoppingCart,
  Boxes,
  ChevronRight,
  ArrowRightLeft,
  ClipboardList,
  Download,
  Scale,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function AppSidebar() {
  const pathname = usePathname();
  const [isStockExpanded, setIsStockExpanded] = useState(false);

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/admin/dashboard",
    },
    {
      title: "Products",
      icon: Package,
      href: "/admin/products",
    },
    {
      title: "Suppliers",
      icon: Truck,
      href: "/admin/suppliers",
    },
    {
      title: "Customers",
      icon: UserCheck,
      href: "/admin/customers",
    },
    {
      title: "Users",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      href: "/admin/orders",
    },
  ];

  const stockSubItems = [
    {
      title: "Stock Transfer",
      icon: ArrowRightLeft,
      href: "/admin/stock/transfer",
    },
    {
      title: "Stock Audit",
      icon: ClipboardList,
      href: "/admin/stock/audit",
    },
    {
      title: "Stock Export Report",
      icon: Download,
      href: "/admin/stock/export-report",
    },
    {
      title: "Stock Balance",
      icon: Scale,
      href: "/admin/stock/balance",
    },
  ];

  const actionItems = [
    {
      title: "Create Supplier Bill",
      icon: FileText,
      href: "/admin/createSupplierBill",
    },
    {
      title: "Create Customer Bill",
      icon: Receipt,
      href: "/admin/createCustomerBill",
    },
  ];

  const handleSignOut = () => {
    // Add your sign out logic here
    console.log("Sign out clicked");
    // Example: router.push('/login');
    // Example: signOut();
  };

  const handleStockToggle = () => {
    setIsStockExpanded(!isStockExpanded);
  };

  // Check if any stock sub-item is active
  const isAnyStockSubItemActive = stockSubItems.some(
    (item) => pathname === item.href
  );
  const isStockActive = pathname === "/admin/stock" || isAnyStockSubItemActive;

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="border">
              <Link href="/dashboard" onClick={(e) => e.stopPropagation()}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Store className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Champika Hardware
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Enterprise
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Navigation Section */}
        <SidebarGroup className="mb-2">
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                    >
                      <Link
                        href={item.href}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* Stock Menu Item with Submenu */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Stock"
                  isActive={isStockActive}
                  onClick={handleStockToggle}
                  className="cursor-pointer"
                >
                  <Boxes className="size-4" />
                  <span>Stock</span>
                  <ChevronRight
                    className={`ml-auto size-4 transition-transform duration-200 ${
                      isStockExpanded ? "rotate-90" : ""
                    }`}
                  />
                </SidebarMenuButton>
                {isStockExpanded && (
                  <SidebarMenuSub>
                    {stockSubItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={isSubActive}>
                            <Link
                              href={subItem.href}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <subItem.icon className="size-4" />
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* Settings */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Settings"
                  isActive={pathname === "/admin/settings"}
                >
                  <Link
                    href="/admin/settings"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Settings className="size-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Actions Section */}
        <SidebarGroup className="mt-[-20px]">
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {actionItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                    >
                      <Link
                        href={item.href}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} tooltip="Sign Out">
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
