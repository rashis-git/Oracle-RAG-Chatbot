import React, { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to finish
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`}
    >
      <div className="flex items-center gap-3 bg-destructive text-destructive-foreground px-4 py-3 rounded-lg shadow-lg border border-red-400">
        <AlertCircle size={20} />
        <span className="text-sm font-medium">{message}</span>
        <button onClick={() => setIsVisible(false)} className="opacity-80 hover:opacity-100 ml-2">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;