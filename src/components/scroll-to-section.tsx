"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface ScrollToSectionProps {
  targetId: string;
  children: React.ReactNode;
  className?: string;
}

export function ScrollToSection({
  targetId,
  children,
  className = "",
}: ScrollToSectionProps) {
  const scrollToSection = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={scrollToSection}
      className={`hover:scale-105 transition-transform duration-200 ${className}`}
    >
      {children}
    </Button>
  );
}

export function ScrollIndicator() {
  const scrollToPrograms = () => {
    const element = document.getElementById("programs-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <Button
        variant="ghost"
        size="sm"
        onClick={scrollToPrograms}
        className="text-primary hover:text-primary/80 hover:scale-110 transition-all duration-200 bg-background/80 backdrop-blur-sm rounded-full p-3"
        aria-label="Scroll to programs section"
      >
        <ChevronDown className="h-6 w-6" />
      </Button>
    </div>
  );
}
