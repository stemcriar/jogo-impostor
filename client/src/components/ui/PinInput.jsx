import React, { useRef, useState, useEffect } from 'react';

export default function PinInput({ length = 8, onComplete, id }) {
  const [pin, setPin] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    // Take only the last character in case of paste
    newPin[index] = value.slice(-1);
    setPin(newPin);

    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (newPin.every((digit) => digit !== '')) {
      onComplete(newPin.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div id={id} className="flex gap-2 justify-center">
      {pin.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-10 h-12 text-center text-xl font-bold bg-white border-2 border-gray-200 rounded-lg focus:border-purple focus:ring-2 focus:ring-purple focus:outline-none transition-all"
        />
      ))}
    </div>
  );
}
