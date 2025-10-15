import React from 'react';
import { cn } from "@/lib/utils";

function Skeleton({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted/40", className)} {...props} aria-hidden />;
}

export { Skeleton };
export default Skeleton;
