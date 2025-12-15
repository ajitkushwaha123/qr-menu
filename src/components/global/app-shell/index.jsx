"use client";

import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { ClerkProvider } from "@clerk/nextjs";

import { store } from "@/store";
import { AuthProvider } from "@/lib/auth/context";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Notification from "../notification";
3;
const AppShell = ({ children }) => {
  return (
    <ClerkProvider>
      <Provider store={store}>
        <AuthProvider>
          <SidebarProvider
            style={{
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            }}
          >
            <div className="flex min-h-screen w-full">
              <AppSidebar variant="inset" />

              <SidebarInset className="flex flex-1 flex-col min-w-0">
                <Notification />
                <SiteHeader />
                <main className="flex-1 min-w-0">{children}</main>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </AuthProvider>
      </Provider>
    </ClerkProvider>
  );
};

export default AppShell;
