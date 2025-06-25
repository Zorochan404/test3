import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorDisplayProps {
  error: any;
  onClose?: () => void;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  onClose, 
  className 
}) => {
  if (!error) return null;

  const errorDetails = error.details || [];
  const errorType = error.errorType || 'GENERAL';

  // For validation errors, show details directly
  // For other errors, show the main message
  const shouldShowDetails = errorType === 'VALIDATION' && errorDetails.length > 0;
  const displayMessage = shouldShowDetails ? null : (error.message || 'An error occurred');

  return (
    <div className={`rounded-lg border p-4 mb-4 ${
      errorType === 'VALIDATION' 
        ? "border-red-200 bg-red-50 text-red-800" 
        : "border-orange-200 bg-orange-50 text-orange-800"
    } ${className || ''}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium">
              {errorType === 'VALIDATION' ? 'Validation Error' : 'Error'}
            </h4>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Show main error message only for non-validation errors */}
          {displayMessage && (
            <p className="mt-1 text-sm">
              {displayMessage}
            </p>
          )}
          
          {/* For validation errors, show details directly */}
          {shouldShowDetails && (
            <div className="mt-2">
              <ul className="text-sm space-y-1">
                {errorDetails.map((detail: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* For non-validation errors that also have details */}
          {!shouldShowDetails && errorDetails.length > 0 && (
            <div className="mt-3">
              <h5 className="text-sm font-medium mb-2">
                Additional details:
              </h5>
              <ul className="text-sm space-y-1">
                {errorDetails.map((detail: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 