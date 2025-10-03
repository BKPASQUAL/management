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
  ChevronRight,
  Box,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { toast } from "sonner";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isStockExpanded, setIsStockExpanded] = useState(
    pathname.startsWith("/admin/stock")
  );
  const [isOrderExpanded, setIsOrderExpanded] = useState(
    pathname.startsWith("/admin/orders")
  );

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
      title: "Customers",
      icon: UserCheck,
      href: "/admin/customers",
    },
    {
      title: "Suppliers",
      icon: Truck,
      href: "/admin/suppliers",
    },
    {
      title: "Reports",
      icon: BarChart3,
      href: "/admin/reports",
    },
  ];

  const stockSubItems = [
    {
      title: "Stock Overview",
      icon: Box,
      href: "/admin/stock",
    },
    {
      title: "Stock Transfer",
      icon: Package,
      href: "/admin/stock/stockTransfer",
    },
    {
      title: "Stock Locations",
      icon: Building2,
      href: "/admin/stock/locations",
    },
  ];

  const orderSubItems = [
    {
      title: "All Orders",
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    {
      title: "Supplier Bills",
      icon: FileText,
      href: "/admin/orders/supplierBills",
    },
    {
      title: "Customer Bills",
      icon: Receipt,
      href: "/admin/orders/customerBills",
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
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const handleStockClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (pathname === "/admin/stock") {
      setIsStockExpanded(!isStockExpanded);
    } else {
      router.push("/admin/stock");
      setIsStockExpanded(true);
    }
  };

  const handleOrderClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (pathname === "/admin/orders") {
      setIsOrderExpanded(!isOrderExpanded);
    } else {
      router.push("/admin/orders");
      setIsOrderExpanded(true);
    }
  };

  const handleStockChevronClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsStockExpanded(!isStockExpanded);
  };

  const handleOrderChevronClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOrderExpanded(!isOrderExpanded);
  };

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      className="hidden md:flex xl:flex lg:hidden"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="border">
              <Link
                href="/admin/dashboard"
                onClick={(e) => e.stopPropagation()}
              >
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

              <SidebarMenuItem>
                <div className="flex items-center">
                  <SidebarMenuButton
                    onClick={handleStockClick}
                    tooltip="Stock"
                    isActive={pathname.startsWith("/admin/stock")}
                    className="flex-1"
                  >
                    <Package className="size-4" />
                    <span>Stock</span>
                  </SidebarMenuButton>
                  <button
                    onClick={handleStockChevronClick}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight
                      className={`size-4 transition-transform ${
                        isStockExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                </div>
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

              <SidebarMenuItem>
                <div className="flex items-center">
                  <SidebarMenuButton
                    onClick={handleOrderClick}
                    tooltip="Orders"
                    isActive={pathname.startsWith("/admin/orders")}
                    className="flex-1"
                  >
                    <ShoppingCart className="size-4" />
                    <span>Orders</span>
                  </SidebarMenuButton>
                  <button
                    onClick={handleOrderChevronClick}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight
                      className={`size-4 transition-transform ${
                        isOrderExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                </div>
                {isOrderExpanded && (
                  <SidebarMenuSub>
                    {orderSubItems.map((subItem) => {
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
