import React from 'react';

export interface AccessibilityProps {
  id?: string;
  className?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: string;
  tabIndex?: number;
}

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & AccessibilityProps>(
  ({ children, className, ariaLabel, ariaDescribedBy, role = 'button', tabIndex = 0, ...props }, ref) => (
    <button
      ref={ref}
      className={className}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      role={role}
      tabIndex={tabIndex}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = 'Button';

export const Link = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & AccessibilityProps>(
  ({ children, className, ariaLabel, ariaDescribedBy, role = 'link', tabIndex = 0, ...props }, ref) => (
    <a
      ref={ref}
      className={className}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      role={role}
      tabIndex={tabIndex}
      {...props}
    >
      {children}
    </a>
  )
);
Link.displayName = 'Link';

export const Nav = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & AccessibilityProps>(
  ({ children, className, ariaLabel, role = 'navigation', ...props }, ref) => (
    <nav
      ref={ref}
      className={className}
      aria-label={ariaLabel}
      role={role}
      {...props}
    >
      {children}
    </nav>
  )
);
Nav.displayName = 'Nav';

export const Main = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & AccessibilityProps>(
  ({ children, className, ariaLabel, role = 'main', ...props }, ref) => (
    <main
      ref={ref}
      className={className}
      aria-label={ariaLabel}
      role={role}
      {...props}
    >
      {children}
    </main>
  )
);
Main.displayName = 'Main';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  level = 1,
  children,
  className,
  id,
  ...props
}) => {
  switch (level) {
    case 1: return <h1 className={className} id={id} {...props}>{children}</h1>;
    case 2: return <h2 className={className} id={id} {...props}>{children}</h2>;
    case 3: return <h3 className={className} id={id} {...props}>{children}</h3>;
    case 4: return <h4 className={className} id={id} {...props}>{children}</h4>;
    case 5: return <h5 className={className} id={id} {...props}>{children}</h5>;
    case 6: return <h6 className={className} id={id} {...props}>{children}</h6>;
    default: return <h1 className={className} id={id} {...props}>{children}</h1>;
  }
};

export const Image = ({
  src,
  alt,
  loading = 'lazy',
  className,
  width,
  height,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  alt: string;
  loading?: 'lazy' | 'eager';
}) => (
  <img
    src={src}
    alt={alt}
    loading={loading}
    className={className}
    width={width}
    height={height}
    data-optimized={true}
    style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
    {...props}
  />
);

export const List = ({
  items,
  renderItem,
  className,
  ordered = false,
  ariaLabel
}: {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  className?: string;
  ordered?: boolean;
  ariaLabel?: string;
}) => {
  const Component = ordered ? 'ol' : 'ul';
  return React.createElement(
    Component,
    { className, role: 'list', 'aria-label': ariaLabel },
    items.map((item, index) => (
      <li key={index} role="listitem">
        {renderItem(item, index)}
      </li>
    ))
  );
};

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & FormFieldProps>(
  ({ id, label, error, required = false, className, ...props }, ref) => (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        ref={ref}
        id={id}
        className={className}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <div id={`${id}-error`} className="error" role="alert">
          {error}
        </div>
      )}
    </div>
  )
);
Input.displayName = 'Input';

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & FormFieldProps & {
  options: Array<{ value: string; label: string }>;
}>(
  ({ id, label, options, error, required = false, className, ...props }, ref) => (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <select
        ref={ref}
        id={id}
        className={className}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div id={`${id}-error`} className="error" role="alert">
          {error}
        </div>
      )}
    </div>
  )
);
Select.displayName = 'Select';

export const Dialog = ({
  isOpen,
  onClose,
  title,
  children,
  className
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className={className}
    >
      <div role="document">
        <Heading level={2} id="dialog-title">
          {title}
        </Heading>
        {children}
        <Button
          onClick={onClose}
          ariaLabel="Close dialog"
          className="close-button"
        >
          ×
        </Button>
      </div>
    </div>
  );
};