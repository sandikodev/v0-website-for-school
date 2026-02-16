"use client";

import { useContext } from "react";
import {
  SchoolContext,
  type SchoolContextValue,
} from "@/app/providers/SchoolProvider";

export function useSchoolConfig(): SchoolContextValue {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error("useSchoolConfig must be used within a SchoolProvider");
  }
  return context;
}

