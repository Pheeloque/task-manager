interface StateMessageProps {
  variant: "loading" | "empty" | "error";
  message: string;
  onRetry?: () => void;
}

export function StateMessage({ variant, message, onRetry }: StateMessageProps) {
  return (
    <div className={`state-message state-message--${variant}`} role={variant === "error" ? "alert" : "status"}>
      <p>{message}</p>
      {variant === "error" && onRetry ? (
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
