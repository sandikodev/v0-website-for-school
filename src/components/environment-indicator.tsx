import { Badge } from "@/components/ui/badge";

interface EnvironmentIndicatorProps {
  environment?: string;
  className?: string;
}

export function EnvironmentIndicator({
  environment,
  className = "",
}: EnvironmentIndicatorProps) {
  // Simple environment detection based on URL
  const getEnvironment = () => {
    if (environment) return environment;

    // For server-side rendering, use NODE_ENV
    if (typeof window === "undefined") {
      return process.env.NODE_ENV || "development";
    }

    // For client-side, detect from URL
    const url = window.location.href;
    if (url.includes("/websekolah-dev/")) return "development";
    if (url.includes("/websekolah-staging/")) return "staging";
    if (url.includes("/websekolah/")) return "production";

    return "development";
  };

  const env = getEnvironment();

  // Environment configuration
  const envConfig = {
    development: {
      label: "DEV",
      color: "bg-green-500 hover:bg-green-600",
      textColor: "text-white",
      description: "Development Environment",
    },
    staging: {
      label: "STAGING",
      color: "bg-yellow-500 hover:bg-yellow-600",
      textColor: "text-white",
      description: "Staging Environment",
    },
    production: {
      label: "PROD",
      color: "bg-red-500 hover:bg-red-600",
      textColor: "text-white",
      description: "Production Environment",
    },
    test: {
      label: "TEST",
      color: "bg-blue-500 hover:bg-blue-600",
      textColor: "text-white",
      description: "Testing Environment",
    },
  };

  const config =
    envConfig[env as keyof typeof envConfig] || envConfig.development;

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <Badge
        className={`${config.color} ${config.textColor} px-3 py-1 text-xs font-bold shadow-lg border-0 cursor-default select-none`}
        title={config.description}
      >
        {config.label}
      </Badge>
    </div>
  );
}

// Alternative floating indicator with more details
export function EnvironmentIndicatorDetailed({
  environment,
  className = "",
}: EnvironmentIndicatorProps) {
  const env = environment || process.env.NODE_ENV || "development";

  const envConfig = {
    development: {
      label: "DEVELOPMENT",
      color: "bg-green-500",
      borderColor: "border-green-400",
      icon: "🔧",
      description: "Development Environment - Hot Reload Active",
    },
    staging: {
      label: "STAGING",
      color: "bg-yellow-500",
      borderColor: "border-yellow-400",
      icon: "🚀",
      description: "Staging Environment - Pre-Production Testing",
    },
    production: {
      label: "PRODUCTION",
      color: "bg-red-500",
      borderColor: "border-red-400",
      icon: "⭐",
      description: "Production Environment - Live System",
    },
    test: {
      label: "TESTING",
      color: "bg-blue-500",
      borderColor: "border-blue-400",
      icon: "🧪",
      description: "Testing Environment - Automated Testing",
    },
  };

  const config =
    envConfig[env as keyof typeof envConfig] || envConfig.development;

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div
        className={`${config.color} ${config.borderColor} border-2 rounded-lg px-3 py-2 shadow-lg cursor-default select-none`}
        title={config.description}
      >
        <div className="flex items-center space-x-2 text-white">
          <span className="text-sm">{config.icon}</span>
          <span className="text-xs font-bold">{config.label}</span>
        </div>
      </div>
    </div>
  );
}

// Minimalist corner indicator
export function EnvironmentIndicatorMinimal({
  environment,
  className = "",
}: EnvironmentIndicatorProps) {
  const env = environment || process.env.NODE_ENV || "development";

  const envConfig = {
    development: { color: "bg-green-500", label: "D" },
    staging: { color: "bg-yellow-500", label: "S" },
    production: { color: "bg-red-500", label: "P" },
    test: { color: "bg-blue-500", label: "T" },
  };

  const config =
    envConfig[env as keyof typeof envConfig] || envConfig.development;

  return (
    <div className={`fixed top-0 right-0 z-50 ${className}`}>
      <div
        className={`${config.color} w-6 h-6 rounded-bl-lg flex items-center justify-center text-white text-xs font-bold shadow-lg`}
        title={`${env.toUpperCase()} Environment`}
      >
        {config.label}
      </div>
    </div>
  );
}
