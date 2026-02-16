"use client";

import { useEffect, useState } from "react";

export function EnvironmentIndicator() {
  const [environment, setEnvironment] = useState("development");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Detect environment from URL
    const url = window.location.href;
    if (url.includes("/websekolah-dev/")) {
      setEnvironment("development");
    } else if (url.includes("/websekolah-staging/")) {
      setEnvironment("staging");
    } else if (url.includes("/websekolah/")) {
      setEnvironment("production");
    } else {
      setEnvironment("development");
    }
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  const envConfig = {
    development: {
      label: "DEV",
      color: "bg-green-500",
      textColor: "text-white",
      description: "Development Environment",
    },
    staging: {
      label: "STAGING",
      color: "bg-yellow-500",
      textColor: "text-white",
      description: "Staging Environment",
    },
    production: {
      label: "PROD",
      color: "bg-red-500",
      textColor: "text-white",
      description: "Production Environment",
    },
  };

  const config =
    envConfig[environment as keyof typeof envConfig] || envConfig.development;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div
        className={`${config.color} ${config.textColor} px-3 py-1 text-xs font-bold shadow-lg border-0 cursor-default select-none rounded-md`}
        title={config.description}
      >
        {config.label}
      </div>
    </div>
  );
}
