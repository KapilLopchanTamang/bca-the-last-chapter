"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

// Dynamic import with no SSR to support WebGL Canvas safely
const GraduationExperience = dynamic(
  () => import("@/components/experience/GraduationExperience"),
  { ssr: false }
);

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingScreen />;
  }

  return (
    <main className="w-full h-full min-h-screen">
      <GraduationExperience />
    </main>
  );
}
