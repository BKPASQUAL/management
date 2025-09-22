"use client";

import React from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Toast as ToastType } from './toast-types';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

const toastVariants = {
  success: {
    bgColor: 'bg-green-50 border-green-200',
    textColor: 'text-green-800',
    iconColor: 'text-green-600',
    icon: CheckCircle,
  },
  error: {
    bgColor: 'bg-red-50 border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-600',
    icon: XCircle,
  },
  warning: {
    bgColor: 'bg-yellow-50 border-yellow-200',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-600',
    icon: AlertTriangle,
  },
  info: {
    bgColor: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-600',
    icon: Info,
  },
};

export const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const variant = toastVariants[toast.type];
  const Icon = variant.icon;

  React.useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-lg border shadow-lg transition-all duration-300 ease-in-out animate-in slide-in-from-right-full',
        variant.bgColor
      )}
    >
      <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', variant.iconColor)} />
      
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className={cn('text-sm font-semibold mb-1', variant.textColor)}>
            {toast.title}
          </h4>
        )}
        {toast.description && (
          <p className={cn('text-sm', variant.textColor)}>
            {toast.description}
          </p>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(toast.id)}
        className={cn(
          'h-6 w-6 p-0 flex-shrink-0 hover:bg-black/10',
          variant.textColor
        )}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};