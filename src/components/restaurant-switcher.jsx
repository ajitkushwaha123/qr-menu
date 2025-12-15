"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import RestaurantOnboarding from "./global/restaurant/restaurant-onboarding";
import Loading from "./loading";

export function RestaurantSwitcher() {
  const { isMobile } = useSidebar();
  const {
    fetchRestaurants,
    activeRestaurant, // full object, not just id
    restaurants,
    isLoading,
    isError,
    setActiveRestaurant,
  } = useRestaurant();

  React.useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const current = activeRestaurant ?? restaurants?.[0];

  const label = isLoading
    ? "Loading restaurants..."
    : current?.name ?? "Select restaurant";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              disabled={isLoading}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                {isLoading ? (
                  <div className="h-6 w-6 animate-pulse rounded-md bg-muted" />
                ) : current?.logoUrl ? (
                  <img
                    className="h-full w-full object-cover"
                    src={current.logoUrl}
                    alt={current.name}
                  />
                ) : (
                  <span className="text-xs font-semibold">
                    {" "}
                    {current?.name[0]?.toUpperCase() ?? "QR"}
                  </span>
                )}
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{label}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {isError
                    ? "Failed to load restaurants"
                    : current?.plan ?? "QR menu workspace"}
                </span>
              </div>

              <ChevronsUpDown className="ml-auto h-4 w-4 opacity-60" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-64"
            align={isMobile ? "start" : "center"}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Your restaurants
            </DropdownMenuLabel>

            {isLoading && (
              <div className="space-y-1 p-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                      <div className="h-2 w-16 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isLoading && <Loading />}

            {!isLoading &&
              restaurants?.map((restaurant) => (
                <DropdownMenuItem
                  key={restaurant._id}
                  onClick={() => {
                    if (restaurant._id !== activeRestaurant?._id) {
                      setActiveRestaurant(restaurant); // pass full object
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted overflow-hidden">
                    {restaurant.logoUrl ? (
                      <img
                        src={restaurant.logoUrl}
                        alt={restaurant.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-semibold">
                        {restaurant.name?.[0]?.toUpperCase() ?? "R"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="truncate text-sm font-medium">
                      {restaurant.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {restaurant.plan ?? "QR menu"}
                    </p>
                  </div>
                  {activeRestaurant?._id === restaurant._id && (
                    <DropdownMenuShortcut>Active</DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              ))}

            {!isLoading && !restaurants?.length && !isError && (
              <div className="px-2 py-3 text-xs text-muted-foreground">
                No restaurants yet. Create one to get started.
              </div>
            )}

            {isError && (
              <div className="px-2 py-3 text-xs text-red-500">
                Could not load restaurants. Pull to refresh or try again.
              </div>
            )}

            <DropdownMenuSeparator />
            <RestaurantOnboarding />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
