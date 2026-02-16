"use client";

import { createContext, useMemo, useState, type ReactNode } from "react";
import type { SchoolConfigData } from "@/lib/school/getSchoolConfig";

export interface SchoolContextValue {
  config: SchoolConfigData;
  setConfig: (value: SchoolConfigData) => void;
}

export const SchoolContext = createContext<SchoolContextValue | undefined>(
  undefined,
);

interface SchoolProviderProps {
  initialConfig: SchoolConfigData;
  children: ReactNode;
}

export function SchoolProvider({
  initialConfig,
  children,
}: SchoolProviderProps) {
  const [config, setConfig] = useState<SchoolConfigData>(initialConfig);
  const value = useMemo(
    () => ({
      config,
      setConfig,
    }),
    [config],
  );

  return (
    <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>
  );
}

export type { SchoolConfigData };

