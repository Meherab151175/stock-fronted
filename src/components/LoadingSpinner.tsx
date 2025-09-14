import React from "react";
import { Loader2 } from "lucide-react";

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
  >
    {children}
  </div>
);

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  variant?: "card" | "inline";
}

export default function LoadingSpinner({
  message = "Loading data...",
  size = "md",
  variant = "card",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const spinnerContent = (
    <div className="flex items-center justify-center">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {message && <span className="ml-2 text-muted-foreground">{message}</span>}
    </div>
  );

  if (variant === "inline") {
    return <div className="py-4">{spinnerContent}</div>;
  }

  return <Card className="p-8">{spinnerContent}</Card>;
}
