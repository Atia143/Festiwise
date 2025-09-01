'use client';

import { motion } from 'framer-motion';
import { forwardRef } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    fullWidth = false, 
    disabled,
    children, 
    className = '', 
    type = 'button',
    onClick,
    ...props 
  }, ref) => {
    const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 focus:ring-purple-500/50 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:hover:scale-100',
      secondary: 'bg-white text-purple-600 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 focus:ring-purple-500/50 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 disabled:hover:scale-100',
      outline: 'border-2 border-white/30 text-white hover:border-white/50 hover:bg-white/10 focus:ring-white/50 backdrop-blur-sm transform hover:scale-105 active:scale-95 disabled:hover:scale-100',
      ghost: 'text-gray-600 hover:text-purple-600 hover:bg-purple-50 focus:ring-purple-500/50 transform hover:scale-105 active:scale-95 disabled:hover:scale-100',
      danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500/50 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:hover:scale-100'
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm min-h-[36px]',
      md: 'px-6 py-3 text-base min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[52px]',
      xl: 'px-10 py-5 text-xl min-h-[60px]'
    };
    
    const disabledClasses = disabled || isLoading 
      ? 'opacity-50 hover:scale-100 hover:shadow-md cursor-not-allowed' 
      : '';
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${widthClass} ${className}`;

    return (
      <motion.button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled || isLoading}
        onClick={onClick}
        whileTap={!disabled && !isLoading ? { scale: 0.95 } : {}}
      >
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
        <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
          {children}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
