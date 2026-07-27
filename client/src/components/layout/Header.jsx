import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ title, showLogo = true, rightContent }) {
  const navigate = useNavigate();
  const clickCount = useRef(0);
  const clickTimer = useRef(null);

  const handleLogoClick = (e) => {
    clickCount.current += 1;
    
    if (clickCount.current === 1) {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 1000);
    }
    
    if (clickCount.current === 3) {
      clearTimeout(clickTimer.current);
      clickCount.current = 0;
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {showLogo && (
          <Link to="/" onClick={handleLogoClick} className="flex-shrink-0">
            <img src="/stem-criar-logo.png" alt="STEM Criar" className="h-10 object-contain rounded-[10px]" />
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
