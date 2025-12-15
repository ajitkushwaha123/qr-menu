"use client";

import React, { useEffect } from "react";
import RestaurantForm from "@/components/global/restaurant/restaurant-form";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import Loading from "@/components/loading";
import EmptyState from "@/components/empty-state";
import RestaurantOnboarding from "@/components/global/restaurant/restaurant-onboarding";

const RestaurantSettingsPage = () => {
  const {
    activeRestaurant,
    activeRestaurantDetails,
    fetchRestaurantById,
    updateRestaurant,
    loading,
    error,
  } = useRestaurant();

  useEffect(() => {
    if (activeRestaurant?._id) {
      fetchRestaurantById(activeRestaurant._id);
    }
  }, [activeRestaurant?._id, fetchRestaurantById]);

  const handleSubmit = async (values) => {
    if (!activeRestaurant?._id) return;

    const formData = new FormData();

    if (values.logo instanceof File) {
      formData.append("logo", values.logo);
    }
    if (values.coverImage instanceof File) {
      formData.append("coverImage", values.coverImage);
    }

    const { logo, coverImage, ...rest } = values;
    formData.append("data", JSON.stringify(rest));

    await updateRestaurant({
      resId: activeRestaurant._id,
      data: formData,
    });
  };

  if (loading && !activeRestaurantDetails) {
    return <Loading className="h-screen" />;
  }

  if (!activeRestaurant) {
    return (
      <div className="container p-6 bg-gray-50">
        <EmptyState
          title="No restaurant selected"
          description="Create or select a restaurant to configure its QR menu settings."
          button={<RestaurantOnboarding className={"bg-black text-white"}/>}
        />
      </div>
    );
  }

  if (error && !activeRestaurantDetails) {
    return (
      <div className="container p-6 bg-gray-50 text-sm text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container p-6 bg-gray-50">
      {activeRestaurantDetails && (
        <RestaurantForm
          initialValues={activeRestaurantDetails}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default RestaurantSettingsPage;
