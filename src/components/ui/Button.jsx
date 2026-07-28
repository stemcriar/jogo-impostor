import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  id,
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary:   'bg-yellow text-gray-900 hover:bg-yellow-light focus:ring-yellow-dark',
    secondary: 'bg-white text-purple border-2 border-purple hover:bg-gray-50 focus:ring-purple',
    danger:    'bg-danger text-white hover:bg-red-600 focus:ring-red-500',
    ghost:     'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-300',
    purple:    'bg-purple text-white hover:bg-purple-dark focus:ring-purple-light',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      id={id}
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
      {children}
    </motion.button>
  );
}
