import * as React from "react";
import { cn } from "@/lib/utils";

export function FormField({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-[11.5px] font-semibold text-text-2 uppercase tracking-wider">
        {label}
        {required && <span className="text-status-rose ml-1">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-[11px] text-status-rose">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-text-3">{hint}</p>
      ) : null}
    </div>
  );
}

const baseInputClasses =
  "w-full px-3 py-2 text-[13px] bg-panel border border-border rounded-md outline-none focus:border-nexa-purple transition placeholder:text-text-4";

export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(baseInputClasses, className)} {...props} />
));
TextInput.displayName = "TextInput";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={4}
    className={cn(baseInputClasses, "resize-y font-mono leading-relaxed", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(baseInputClasses, "appearance-none pr-8 cursor-pointer", className)}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
