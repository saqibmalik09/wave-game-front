'use client';
import React, { useState } from "react";
import { getCache, setCache } from "@/lib/cache";
import { gameConfiguration } from "@/lib/socket/socketEventHandlers";
import { useRouter } from "next/navigation";



export default function Home() {
  const router = useRouter();
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}