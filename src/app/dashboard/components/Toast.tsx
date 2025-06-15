"use client";

import { useEffect, useState } from "react";

type ToastType = {
  id: string;
  message: string;
  type: "success" | "error";
  duration?: number;
};

let toasts: ToastType[] = [];
let listeners: Array<() => void> = [];

export default function ToastComponent(
  message: string,
  type: "success" | "error" = "success",
  duration: number = 3000
) {
  const id = Math.random().toString(36).substring(2, 9);
  toasts = [...toasts, { id, message, type, duration }];
  emitChange();

  if (duration > 0) {
    setTimeout(() => dismissToast(id), duration);
  }
}

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emitChange();
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function useToastStore() {
  const [toastsState, setToastsState] = useState<ToastType[]>(toasts);

  useEffect(() => {
    const listener = () => setToastsState([...toasts]);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return toastsState;
}

export function Toast() {
  const toasts = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start justify-between p-3 pr-4 rounded-md shadow-lg min-w-[250px] max-w-[300px] ${
            toast.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-start">
            <div className={`mt-0.5 mr-2`}>
              {toast.type === "success" ? (
                <span className="inline-block w-4 h-4 text-green-500">✓</span>
              ) : (
                <span className="inline-block w-4 h-4 text-red-500">✕</span>
              )}
            </div>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="ml-2 text-gray-400 hover:text-gray-500 text-sm"
          >
            <span className="sr-only">Close</span>
            <span aria-hidden="true">×</span>
          </button>
        </div>
      ))}
    </div>
  );
}
