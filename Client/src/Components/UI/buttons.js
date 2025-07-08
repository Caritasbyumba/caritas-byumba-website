import React from 'react';

const Button = ({ onClick, text, variant = 'primary', size = 'medium', disabled = false }) => {
  const baseClasses = "rounded font-medium transition-colors focus:outline-none focus:ring-2";
  
  const sizeClasses = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg"
  };

  const variantClasses = {
    primary: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-300",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300",
    outline: "border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-300"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {text}
    </button>
  );
};

export default Button;