import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, id, className = '', ...props }, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`w-full px-4 py-2 bg-white border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-colors disabled:text-gray-400 disabled:bg-gray-50 ${
          error ? 'border-danger focus:ring-danger' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
