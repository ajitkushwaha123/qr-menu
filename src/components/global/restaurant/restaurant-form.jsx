"use client";

import React, { useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useNotification } from "@/store/hooks/useNotification";

const validationSchema = Yup.object({
  name: Yup.string().min(2).max(120).required("Name is required"),
  slug: Yup.string().min(2).max(120).required("Slug is required"),
  description: Yup.string().max(500),
  logo: Yup.mixed().nullable().optional(),
  coverImage: Yup.mixed().nullable().optional(),
  email: Yup.string().email("Invalid email").nullable().optional(),
  phone: Yup.string().nullable().optional(),
  address: Yup.object({
    street: Yup.string().nullable().optional(),
    city: Yup.string().nullable().optional(),
    state: Yup.string().nullable().optional(),
    zipCode: Yup.string().nullable().optional(),
    country: Yup.string().min(2).max(3).required("Country is required"),
  }),
  isOnboardingComplete: Yup.boolean(),
  theme: Yup.object({
    primaryColor: Yup.string().required(),
    secondaryColor: Yup.string().required(),
    darkMode: Yup.boolean(),
  }),
});

const defaultValues = {
  name: "",
  slug: "",
  description: "",
  logo: null,
  coverImage: null,
  email: "",
  phone: "",
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "IN",
  },
  isOnboardingComplete: false,
  theme: {
    primaryColor: "#111827",
    secondaryColor: "#F97316",
    darkMode: false,
  },
};

export default function RestaurantForm({ initialValues, onSubmit }) {
  const { error, success } = useNotification();

  const formik = useFormik({
    initialValues: {
      ...defaultValues,
      ...(initialValues || {}),
      address: {
        ...defaultValues.address,
        ...(initialValues?.address || {}),
      },
      theme: {
        ...defaultValues.theme,
        ...(initialValues?.theme || {}),
      },
      logo: null,
      coverImage: null,
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        await onSubmit?.(values);
        success("Restaurant saved successfully");
      } catch (e) {
        error("Failed to save restaurant");
      } finally {
        helpers.setSubmitting(false);
      }
    },
    validateOnBlur: true,
    validateOnChange: false,
    enableReinitialize: true,
  });

  const submitting = formik.isSubmitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = await formik.validateForm();
    if (Object.keys(validationErrors).length > 0) {
      const firstErrorMessage =
        validationErrors.name ||
        validationErrors.slug ||
        validationErrors.email ||
        validationErrors.address?.country ||
        "Please fix the required fields before saving.";
      error(firstErrorMessage);
      return;
    }
    formik.handleSubmit(e);
  };

  const handleFileDrop = (field) => (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      formik.setFieldValue(field, file);
    }
  };

  const handleFileChange = (field) => (e) => {
    const file = e.currentTarget.files?.[0] || null;
    formik.setFieldValue(field, file);
  };

  const logoPreview = useMemo(() => {
    if (formik.values.logo instanceof File) {
      return URL.createObjectURL(formik.values.logo);
    }
    return initialValues?.logoUrl || "";
  }, [formik.values.logo, initialValues?.logoUrl]);

  const coverPreview = useMemo(() => {
    if (formik.values.coverImage instanceof File) {
      return URL.createObjectURL(formik.values.coverImage);
    }
    return initialValues?.coverImageUrl || "";
  }, [formik.values.coverImage, initialValues?.coverImageUrl]);

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex flex-col gap-6 pb-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Restaurant setup
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Capture all the details needed to create a beautiful QR menu site.
        </p>
      </header>

      {/* BASIC + IMAGES */}
      <Card>
        <CardHeader>
          <CardTitle>Basic information</CardTitle>
          <CardDescription>Brand identity and public details.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Name</label>
            <Input
              name="name"
              placeholder="Pasta Palace"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              name="description"
              rows={3}
              placeholder="Short tagline or description of the restaurant."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          {/* Logo drag & drop */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Logo</label>
            <div
              onDrop={handleFileDrop("logo")}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-input bg-muted/40 px-4 py-6 text-center"
            >
              {logoPreview ? (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-20 w-20 rounded-md object-cover border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="text-xs"
                    onClick={() =>
                      document.getElementById("logo-input")?.click()
                    }
                  >
                    Change logo
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground">
                    Drag & drop logo here, or click to upload.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("logo-input")?.click()
                    }
                  >
                    Upload logo
                  </Button>
                </>
              )}
              <input
                id="logo-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange("logo")}
              />
            </div>
          </div>

          {/* Cover drag & drop */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Cover image</label>
            <div
              onDrop={handleFileDrop("coverImage")}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-input bg-muted/40 px-4 py-6 text-center"
            >
              {coverPreview ? (
                <div className="flex flex-col items-center gap-3 w-full">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="h-24 w-full rounded-md object-cover border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="text-xs"
                    onClick={() =>
                      document.getElementById("cover-input")?.click()
                    }
                  >
                    Change cover
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground">
                    Drag & drop cover image here, or click to upload.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("cover-input")?.click()
                    }
                  >
                    Upload cover
                  </Button>
                </>
              )}
              <input
                id="cover-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange("coverImage")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CONTACT & ADDRESS */}
      <Card>
        <CardHeader>
          <CardTitle>Contact & address</CardTitle>
          <CardDescription>
            Make it easy for guests to contact and find the restaurant.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="contact@pasta-palace.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Phone</label>
              <Input
                name="phone"
                placeholder="+91 98765 43210"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Street</label>
              <Input
                name="address.street"
                placeholder="123 MG Road"
                value={formik.values.address.street}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">City</label>
              <Input
                name="address.city"
                placeholder="Bengaluru"
                value={formik.values.address.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">State</label>
              <Input
                name="address.state"
                placeholder="Karnataka"
                value={formik.values.address.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">ZIP / Postal code</label>
              <Input
                name="address.zipCode"
                placeholder="560001"
                value={formik.values.address.zipCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Country</label>
              <Input
                name="address.country"
                placeholder="IN"
                value={formik.values.address.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* THEME */}
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Customize the primary look and feel of the menu.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Primary color</label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                className="h-9 w-9 p-1"
                name="theme.primaryColor"
                value={formik.values.theme.primaryColor}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <Input
                name="theme.primaryColor"
                placeholder="#111827"
                value={formik.values.theme.primaryColor}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Secondary color</label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                className="h-9 w-9 p-1"
                name="theme.secondaryColor"
                value={formik.values.theme.secondaryColor}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <Input
                name="theme.secondaryColor"
                placeholder="#F97316"
                value={formik.values.theme.secondaryColor}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border bg-muted/40 px-3 py-2">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Dark mode</p>
              <p className="text-xs text-muted-foreground">
                Use a darker theme for low light environments.
              </p>
            </div>
            <Switch
              checked={formik.values.theme.darkMode}
              onCheckedChange={(v) => formik.setFieldValue("theme.darkMode", v)}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save restaurant"}
        </Button>
      </div>
    </form>
  );
}
