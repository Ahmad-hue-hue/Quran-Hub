import { Toaster as Sonner } from "sonner";

export const toast = {
  success: (message) => {
    if (typeof window !== 'undefined' && window.toastSuccess) {
      window.toastSuccess(message);
    }
  },
  error: (message) => {
    if (typeof window !== 'undefined' && window.toastError) {
      window.toastError(message);
    }
  },
  warning: (message) => {
    if (typeof window !== 'undefined' && window.toastWarning) {
      window.toastWarning(message);
    }
  },
};

export function Toaster() {
  return (
    <Sonner
      position="bottom-left"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg bg-white border border-gray-200",
          success: "border-l-4 border-l-primary",
          error: "border-l-4 border-l-red-600",
          warning: "border-l-4 border-l-yellow-500",
          title: "text-sm font-medium text-gray-900",
          description: "text-sm text-gray-500",
        },
      }}
      theme="light"
      richColors={false}
      closeButton={true}
    />
  );
}

export { toast as useToast } from "sonner";
