
"use client";

import React from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const { slug } = useParams();

  return <div>Tenant page for: {slug}</div>;
};

export default Page;
