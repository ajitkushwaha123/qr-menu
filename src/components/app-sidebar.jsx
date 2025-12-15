"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { RestaurantSwitcher, TeamSwitcher } from "./restaurant-switcher";
import { useOrganization } from "@clerk/nextjs";
import { GalleryVerticalEnd, Library } from "lucide-react";

const data = {
  navMain: [
    // {
    //   title: "Billing",
    //   url: "/billing",
    //   icon: IconFolder,
    // },
    // {
    //   title: "Orders",
    //   url: "/orders",
    //   icon: IconListDetails,
    // },
    // {
    //   title: "Update Inventory",
    //   url: "/update-inventory",
    //   icon: IconChartBar,
    // },
    // {
    //   title: "Products",
    //   url: "/products",
    //   icon: IconListDetails,
    // },
    // {
    //   title: "Product Library",
    //   url: "/product-library",
    //   icon: Library,
    // },
  ],
};

export function AppSidebar({ ...props }) {
  const team = {
    name: "QR MENU",
    plan: "Pro Plan",
    logo: "/assets/logo.jpg",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full">
              <RestaurantSwitcher />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
