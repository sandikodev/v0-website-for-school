import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm",
        "placeholder:text-muted-foreground",
        "transition-all duration-200",
        "hover:border-primary/40 hover:shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "dark:bg-input dark:border-input dark:hover:border-primary/60",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
