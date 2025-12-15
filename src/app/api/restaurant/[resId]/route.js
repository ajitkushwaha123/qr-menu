import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth/clerk";
import Restaurant from "@/models/Restaurant";
import { uploadToS3 } from "@/lib/s3";

export async function GET(req, { params }) {
  try {
    const { resId } = await params;
    const { userId } = await getUserId(req);

    if (!resId) {
      return NextResponse.json(
        { error: "Restaurant ID is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const restaurant = await Restaurant.findOne({
      _id: resId,
      ownerClerkUserId: userId,
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: restaurant }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { resId } = await params;
    const { userId } = await getUserId(req);

    if (!resId) {
      return NextResponse.json(
        { error: "Restaurant ID is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let payload = {};
    let logoUrl;
    let coverImageUrl;

    const contentType = req.headers.get("content-type") || "";

    // Handle multipart/form-data (files + fields)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      const logoFile = formData.get("logo");
      const coverFile = formData.get("coverImage");

      if (logoFile && logoFile.size > 0) {
        logoUrl = await uploadToS3(logoFile, `restaurants/${resId}/logo`);
      }

      if (coverFile && coverFile.size > 0) {
        coverImageUrl = await uploadToS3(
          coverFile,
          `restaurants/${resId}/cover`
        );
      }

      const jsonString = formData.get("data");
      payload = jsonString ? JSON.parse(jsonString) : {};
    } else {
      payload = await req.json();
    }

    const update = {
      ...(payload.name && { name: payload.name }),
      ...(payload.slug && { slug: payload.slug }),
      ...(payload.description && { description: payload.description }),
      ...(payload.email && { email: payload.email }),
      ...(payload.phone && { phone: payload.phone }),
      ...(payload.address && { address: payload.address }),
      ...(payload.plan && { plan: payload.plan }),
      ...(typeof payload.isOnboardingComplete === "boolean" && {
        isOnboardingComplete: payload.isOnboardingComplete,
      }),
      ...(payload.status && { status: payload.status }),
      ...(payload.subdomain && { subdomain: payload.subdomain }),
      ...(payload.customDomain && { customDomain: payload.customDomain }),
      ...(payload.domainStatus && { domainStatus: payload.domainStatus }),
      ...(payload.theme && { theme: payload.theme }),
    };

    if (logoUrl) update.logoUrl = logoUrl;
    if (coverImageUrl) update.coverImageUrl = coverImageUrl;

    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: resId, ownerClerkUserId: userId },
      { $set: update },
      { new: true }
    );

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: restaurant }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
