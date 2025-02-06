import React, { useEffect, useState } from 'react';
import styles from './Toast.module.scss';
import { CheckCircle, Info, AlertCircle } from 'react-feather';

export interface ToastProps {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
  onRemove: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  info: Info,
  error: AlertCircle,
};

export const Toast: React.FC<ToastProps> = ({ id, type, title, message, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);
  const Icon = icons[type];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsExiting(true);
    }, 4700); // Start exit animation before 5s

    const removeTimeout = setTimeout(() => {
      onRemove(id);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(removeTimeout);
    };
  }, [id, onRemove]);

  return (
    <div className={`${styles.toast} ${styles[type]} ${isExiting ? styles.exiting : ''}`}>
      <Icon className={styles.icon} size={20} />
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.message}>{message}</div>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastProps[] }> = ({ toasts }) => {
  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};
