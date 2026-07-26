import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ title, showLogo = true, rightContent }) {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {showLogo && (
          <Link to="/" className="flex-shrink-0">
            <img src="/stem-criar-logo.png" alt="STEM Criar" className="h-10 object-contain" />
          </Link>
        )}
        {title && (
          <h1 className="text-lg sm:text-xl font-bold text-purple break-words">{title}</h1>
        )}
      </div>
      {rightContent && <div>{rightContent}</div>}
    </header>
  );
}
