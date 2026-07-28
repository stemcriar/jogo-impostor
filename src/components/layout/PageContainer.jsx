import React from 'react';

export default function PageContainer({ children, className = '', id }) {
  return (
    <div id={id} className={`min-h-screen bg-gray-50 flex flex-col ${className}`}>
      <main className="flex-grow max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {children}
      </main>
    </div>
  );
}
