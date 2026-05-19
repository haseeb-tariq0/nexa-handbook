import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  primary:
    "bg-text-1 text-white hover:bg-nexa-purple disabled:bg-text-3 disabled:cursor-not-allowed",
  secondary:
    "bg-panel border border-border text-text-1 hover:bg-panel-2 hover:border-border-3 disabled:opacity-60 disabled:cursor-not-allowed",
  danger:
    "bg-status-rose text-white hover:bg-status-rose/90 disabled:bg-text-3 disabled:cursor-not-allowed",
  ghost:
    "text-text-2 hover:text-text-1 hover:bg-panel-2 disabled:opacity-60 disabled:cursor-not-allowed",
};

const sizes: Record<Size, string> = {
  sm: "px-2.5 py-1.5 text-[11.5px] gap-1",
  md: "px-3.5 py-2 text-[12.5px] gap-1.5",
};

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
  }
>(({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-3 w-3 animate-spin" />}
      {children}
    </button>
  );
});
Button.displayName = "Button";
