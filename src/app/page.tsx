'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Introduction from "./Introduction";



export default function Home() {
  const router = useRouter();
  return (
    <>
      <Introduction />
    </>
  )
}