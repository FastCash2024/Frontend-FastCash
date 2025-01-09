import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

const Alert = ({ children, type = 'success', duration = 5000, onClose }) => {
  const { theme } = useTheme()
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Clases de estilo según el tipo de alerta
  const alertClasses = {
    success: 'bg-[#88b188] dark:bg-[#b4d3b4]  text-white',
    error: 'bg-[#ffcdcd] dark:bg-[#ffbfbf] text-white',
    warning: 'bg-orange-500 text-white',
  };

  return (
    show && (
      <div
        className={`
         absolute right-5 top-[90px] max-w-[500px] transition-all transform  duration-5000 ease-in-out opacity-100 ${alertClasses[type]} p-4 rounded-lg shadow-lg flex items-center space-x-3 z-50`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          {/* Iconos según el tipo */}
          {type === 'success' && (
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke={"green"}
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          )}
          {type === 'error' && (
            <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke={"#ff6363"}
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />

          )}
          {type === 'warning' && (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3m0 4v.01M2 12l10-10 10 10H2z"
            />
          )}
        </svg>
        <p className="text-sm ">{children}</p>
      </div>
    )
  );
};

export default Alert;
