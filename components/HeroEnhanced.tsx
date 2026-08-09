"use client";
import dynamic from "next/dynamic";
const HeroVisual = dynamic(() => import("./HeroVisual"), { ssr: false });
export default function HeroEnhanced() { return <HeroVisual />; }
