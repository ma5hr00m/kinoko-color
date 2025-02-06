import { create } from 'zustand';
import { ToastProps } from '../components/Toast/Toast';

interface ToastStore {
  toasts: ToastProps[];
  addToast: (type: ToastProps['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (type, title, message) => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { id, type, title, message, onRemove: state.removeToast }],
    }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));

// Utility functions for easier toast creation
export const toast = {
  success: (title: string, message: string) => {
    useToastStore.getState().addToast('success', title, message);
  },
  info: (title: string, message: string) => {
    useToastStore.getState().addToast('info', title, message);
  },
  error: (title: string, message: string) => {
    useToastStore.getState().addToast('error', title, message);
  },
};
