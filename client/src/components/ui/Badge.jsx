import React from 'react';

export default function Badge({ children, variant = 'gray', className = '', id }) {
  const variants = {
    purple: 'bg-purple-100 text-purple-dark',
    yellow: 'bg-yellow-100 text-yellow-dark',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800'
  };

  return (
    <span id={id} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
