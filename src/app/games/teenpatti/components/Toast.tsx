// src/app/teenpatti/components/Toast.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning';
  duration?: number;
  onClose: () => void;
}

function Toast({ message, type = 'error', duration = 1000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColors = {
    success: 'linear-gradient(135deg, #22c55e, #16a34a)',
    error: 'linear-gradient(135deg, #ef4444, #dc2626)',
    warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
  };

  return (
    <div
      className="position-fixed start-50 translate-middle-x d-flex align-items-center"
      style={{
        bottom: isVisible ? '90px' : '70px',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s ease',
        background: bgColors[type],
        padding: '8px 10px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
        zIndex: 99999,
        minWidth: '180px',
        maxWidth: '260px',
        textAlign: 'center',
      }}
    >
      <span className="text-white fw-semibold w-100"
        style={{
          fontSize: '14px',
          lineHeight: 1.2,
        }}
      >
        {message}
      </span>
    </div>
  );
}

// Hook for using toasts
export function useToast() {
  const [toasts, setToasts] = useState<
    Array<{ id: number; message: string; type: 'success' | 'error' | 'warning' }>
  >([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );

  return { showToast, ToastContainer };
}

export default Toast;
