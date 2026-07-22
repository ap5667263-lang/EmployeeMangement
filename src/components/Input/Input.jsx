import "./Input.scss";

function Input({
  label,
  type = "text",
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  autoComplete = "off",
  ...rest
}) {
  return (
    <div className="input">
      {label && (
        <label htmlFor={id || name} className="input__label">
          {label}
        </label>
      )}

      <input
        id={id || name}
        className={`input__field ${error ? "input__field--error" : ""}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        {...rest}
      />

      {error && <p className="input__error">{error}</p>}
    </div>
  );
}

export default Input;