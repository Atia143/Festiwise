import type { ComponentType, ElementType, ReactNode } from 'react';
import { forwardRef } from 'react';

/* eslint-disable react/display-name */

interface WithAccessibilityProps {
  id?: string;
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: string;
  tabIndex?: number;
}

export const withAccessibility = <P extends WithAccessibilityProps>(
  Component: ElementType,
  defaultProps: Partial<P> = {}
) => {
  const Wrapped = forwardRef<HTMLElement, P>(({ className, children, ariaLabel, ariaDescribedBy, ...props }, ref) => {
    const accessibilityProps = {
      ...defaultProps,
      ...props,
      className,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ref,
    };

    return <Component {...accessibilityProps}>{children}</Component>;
  });

  try {
    const compName = typeof Component === 'string' ? Component : (Component as any).displayName || (Component as any).name || 'Component';
    (Wrapped as any).displayName = `Accessible(${compName})`;
  } catch (e) {
    // ignore
  }

  return Wrapped;
};

export const AccessibleButton = withAccessibility('button', {
  role: 'button',
  tabIndex: 0
});

export const AccessibleLink = withAccessibility('a', {
  role: 'link',
  tabIndex: 0
});

export const AccessibleNav = withAccessibility('nav', {
  role: 'navigation'
});

export const AccessibleMain = withAccessibility('main', {
  role: 'main'
});

export const AccessibleAside = withAccessibility('aside', {
  role: 'complementary'
});

export const AccessibleHeader = withAccessibility('header', {
  role: 'banner'
});

export const AccessibleFooter = withAccessibility('footer', {
  role: 'contentinfo'
});

export const AccessibleSection = withAccessibility('section', {
  role: 'region'
});

export const AccessibleArticle = withAccessibility('article', {
  role: 'article'
});

interface HeadingProps extends WithAccessibilityProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export const AccessibleHeading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level, children, className, ...props }, ref) => {
    const Component = `h${level}` as ElementType;
    return (
      <Component ref={ref} className={className} {...props}>
        {children}
      </Component>
    );
  }
);
(AccessibleHeading as any).displayName = 'AccessibleHeading';

interface AccessibleImageProps {
  src: string;
  alt: string;
  loading?: 'lazy' | 'eager';
  className?: string;
  width?: number;
  height?: number;
}

export const AccessibleImage = ({
  src,
  alt,
  loading = 'lazy',
  className,
  width,
  height
}: AccessibleImageProps) => (
  <img
    src={src}
    alt={alt}
    loading={loading}
    className={className}
    width={width}
    height={height}
    role="img"
    data-optimized={true}
    style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
  />
);

export const AccessibleList = ({
  items,
  renderItem,
  className,
  ordered = false,
  ariaLabel
}: {
  items: any[];
  renderItem: (item: any) => ReactNode;
  className?: string;
  ordered?: boolean;
  ariaLabel?: string;
}) => {
  const ListTag = ordered ? 'ol' : 'ul';
  return (
    <ListTag className={className} role="list" aria-label={ariaLabel}>
      {items.map((item, index) => (
        <li key={index} role="listitem">
          {renderItem(item)}
        </li>
      ))}
    </ListTag>
  );
};

export const AccessibleDialog = ({
  isOpen,
  onClose,
  title,
  children,
  className
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
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
        <h2 id="dialog-title">{title}</h2>
        {children}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="close-button"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export const AccessibleForm = ({
  onSubmit,
  children,
  className,
  ariaLabel
}: {
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) => (
  <form
    onSubmit={onSubmit}
    className={className}
    role="form"
    aria-label={ariaLabel}
  >
    {children}
  </form>
);

export const AccessibleInput = ({
  id,
  label,
  type = 'text',
  required = false,
  error,
  ...props
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  [key: string]: any;
}) => (
  <div className="form-field">
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      type={type}
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
);

export const AccessibleSelect = ({
  id,
  label,
  options,
  value,
  onChange,
  required = false,
  error
}: {
  id: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  error?: string;
}) => (
  <div className="form-field">
    <label htmlFor={id}>{label}</label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      aria-required={required}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
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
);