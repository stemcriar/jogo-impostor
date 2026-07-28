import React from 'react';

const variants = {
  purple:  'bg-purple-100 text-purple-dark border border-purple-200',
  yellow:  'bg-yellow-100 text-yellow-dark border border-yellow-200',
  success: 'bg-green-100 text-green-700 border border-green-200',
  danger:  'bg-red-100 text-danger border border-red-200',
  gray:    'bg-gray-100 text-gray-600 border border-gray-200',
};

export default function Badge({ children, variant = 'gray', className = '' }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
