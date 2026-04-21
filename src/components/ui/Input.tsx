import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            "w-full px-3 py-2 text-sm border rounded bg-white text-ink placeholder:text-muted transition-colors",
            error
              ? "border-red-400 focus:outline-none focus:ring-2 focus:ring-red-300"
              : "border-border focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal",
            className,
          ].join(" ")}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
