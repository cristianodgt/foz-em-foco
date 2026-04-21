"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface BreakingBarProps {
  text: string;
  href?: string;
}

export default function BreakingBar({ text, href = "#" }: BreakingBarProps) {
  return (
    <div className="bg-red-600 text-white text-sm font-semibold py-2">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        <span className="flex items-center gap-1.5 bg-white text-red-600 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider shrink-0">
          <AlertTriangle size={12} />
          Urgente
        </span>
        <Link href={href} className="hover:underline line-clamp-1 flex-1">
          {text}
        </Link>
      </div>
    </div>
  );
}
