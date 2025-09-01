'use client';

import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';

interface TextAreaProps {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  name?: string;
  id?: string;
  rows?: number;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ 
    label, 
    error, 
    helperText, 
    className = '', 
    required,
    placeholder,
    value,
    onChange,
    onFocus: propOnFocus,
    onBlur: propOnBlur,
    disabled,
    name,
    id,
    rows = 4,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      propOnFocus?.(e);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      propOnBlur?.(e);
    };
    
    const baseClasses = 'w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 resize-none';
    const normalClasses = 'border-gray-300 focus:border-purple-500 focus:ring-purple-500/50';
    const errorClasses = 'border-red-300 focus:border-red-500 focus:ring-red-500/50 bg-red-50';
    
    const textareaClasses = `${baseClasses} ${error ? errorClasses : normalClasses} ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <textarea
            ref={ref}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            name={name}
            id={id}
            rows={rows}
            className={textareaClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          
          {isFocused && (
            <motion.div
              className="absolute inset-0 border-2 border-purple-500 rounded-lg pointer-events-none"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 0.5, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </div>
        
        {error && (
          <motion.p
            className="mt-2 text-sm text-red-600 flex items-center"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
