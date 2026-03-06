import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-white mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-all duration-200
            glass-effect text-white
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30 focus:shadow-neon-sm'
              : 'border-electric-violet/30 focus:border-electric-violet focus:ring-electric-violet/30 focus:shadow-neon-sm'
            }
            placeholder:text-white/40
            disabled:bg-white/5 disabled:text-white/30 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1.5 text-sm text-white/60">{hint}</p>
        )}
        {error && (
          <p className="mt-1.5 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
