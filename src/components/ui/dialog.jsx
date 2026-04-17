import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 w-full max-w-md mx-4">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const DialogHeader = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-100">
    {children}
  </div>
);

const DialogTitle = ({ children }) => (
  <h3 className="text-lg font-display font-semibold text-gray-900">
    {children}
  </h3>
);

const DialogDescription = ({ children }) => (
  <p className="mt-1 text-sm text-gray-500">
    {children}
  </p>
);

const DialogFooter = ({ children }) => (
  <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
    {children}
  </div>
);

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };
