"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNotification } from "@/store/hooks/useNotification";
import { useRestaurant } from "@/store/hooks/useRestaurant";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name is too short")
    .max(120)
    .required("Name is required"),
  slug: Yup.string()
    .min(2, "Slug is too short")
    .max(120)
    .required("Slug is required"),
});

const defaultValues = {
  name: "",
  slug: "",
};

const RestaurantOnboarding = ({ className }) => {
  const [open, setOpen] = useState(false);
  const { error } = useNotification();
  const { setActiveRestaurant, createRestaurant } = useRestaurant();

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const action = await createRestaurant(values);
        if (action.meta.requestStatus === "rejected") {
          return;
        }
        const restaurant = action.payload;
        if (restaurant) {
          setActiveRestaurant(restaurant);
        }
        // success: close dialog and reset form
        setOpen(false);
        helpers.resetForm();
      } finally {
        helpers.setSubmitting(false);
      }
    },
    validateOnChange: false,
    validateOnBlur: true,
  });

  const submitting = formik.isSubmitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = await formik.validateForm();
    if (Object.keys(validationErrors).length > 0) {
      const firstError =
        validationErrors.name ||
        validationErrors.slug ||
        "Please fill in all required fields.";
      error(firstError);
      return;
    }
    formik.handleSubmit(e);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start ${className}`}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Restaurant
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Restaurant onboarding
          </DialogTitle>
          <DialogDescription>
            Give your restaurant a name and a clean, shareable URL for your QR
            menu.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Restaurant name</label>
            <Input
              name="name"
              placeholder="Pasta Palace"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <p className="text-xs text-muted-foreground">
              This is how your restaurant will appear to customers.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Slug</label>
            <div className="flex items-center rounded-md border border-input bg-background text-sm focus-within:ring-2 focus-within:ring-ring">
              <span className="px-3 text-muted-foreground">yourapp.com/</span>
              <Input
                name="slug"
                className="border-0 focus-visible:ring-0"
                placeholder="pasta-palace"
                value={formik.values.slug}
                onChange={(e) => {
                  const val = e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "");
                  formik.setFieldValue("slug", val);
                }}
                onBlur={formik.handleBlur}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Used in your public menu link. You can change this later.
            </p>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Creating..." : "Continue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantOnboarding;
