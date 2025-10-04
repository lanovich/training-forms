import {
  forwardRef,
  type ReactNode,
  type InputHTMLAttributes,
  useId,
} from "react";
import styles from "./Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: "default" | "filled" | "unstyled";
  theme?: "primary" | "default" | "ghost";
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      variant = "default",
      theme = "default",
      icon,
      placeholder,
      id,
      className = "",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || props.name || generatedId;

    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}

        <div
          className={`${styles.inputContainer} ${styles[variant]} ${
            styles[theme]
          } ${error ? styles.errorState : ""}`}
        >
          {icon && (
            <div className={styles.iconWrapper}>
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={styles.inputElement}
            placeholder={placeholder}
            {...props}
          />
        </div>

        {error && <div className={styles.errorText}>{error}</div>}
      </div>
    );
  }
);

Input.displayName = "Input";
