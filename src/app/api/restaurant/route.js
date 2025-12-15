import { getUserId } from "@/lib/auth/clerk";
import dbConnect from "@/lib/dbConnect";
import Restaurant from "@/models/Restaurant";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await dbConnect();

    const { userId } = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug } = body || {};

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const existingBySlug = await Restaurant.findOne({ slug }).lean();
    if (existingBySlug) {
      return NextResponse.json(
        { error: "Slug already exists. Please choose another one." },
        { status: 400 }
      );
    }

    const restaurants = await Restaurant.find({
      ownerClerkUserId: userId,
    }).lean();

    if (restaurants.length >= 5) {
      return NextResponse.json(
        {
          error:
            "Restaurant limit reached. You can create up to 5 restaurants.",
        },
        { status: 403 }
      );
    }

    const restaurant = await Restaurant.create({
      ownerClerkUserId: userId,
      name,
      slug,
    });

    return NextResponse.json(
      {
        message: "Restaurant created successfully",
        data: restaurant,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[RESTAURANT_POST]", err);
    return NextResponse.json(
      { error: "Failed to create restaurant" },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    await dbConnect();

    const { userId } = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const restaurants = await Restaurant.find({
      ownerClerkUserId: userId,
    })
      .select("_id name slug logo plan")
      .lean();

    return NextResponse.json({ data: restaurants }, { status: 200 });
  } catch (err) {
    console.error("[RESTAURANT_GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
};
