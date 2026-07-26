import React from 'react';

export default function Card({ children, className = '', padding = 'p-6', id }) {
  return (
    <div 
      id={id}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-purple overflow-hidden ${padding} ${className}`}
    >
      {children}
    </div>
  );
}
