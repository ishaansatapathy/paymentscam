import React from 'react';
import AppIcon from "./AppIcon";  // ✅ only this import

const ResultDisplay = ({ result }) => {
  if (!result) return null;

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'safe':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          iconName: 'CheckCircle'
        };
      case 'suspicious':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          iconName: 'AlertTriangle'
        };
      case 'error':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          iconName: 'XCircle'
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          iconName: 'Info'
        };
    }
  };

  const config = getStatusConfig(result?.status);

  return (
    <div
      className={`p-6 rounded-lg border-2 ${config?.bgColor} ${config?.borderColor} 
                  transition-all duration-500 ease-in-out transform animate-fade-in`}
    >
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 ${config?.iconColor}`}>
          <AppIcon name={config?.iconName} size={24} strokeWidth={2} />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${config?.textColor}`}>
              Security Status: {result?.status?.toUpperCase()}
            </h3>
          </div>

          <p className={`text-sm ${config?.textColor} leading-relaxed`}>
            {result?.message}
          </p>

          <div
            className={`text-xs ${config?.textColor} opacity-75 pt-2 border-t border-current/20`}
          >
            <div className="flex items-center space-x-2">
              <AppIcon name="User" size={14} strokeWidth={2} />
              <span>UPI ID: {result?.upiId}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <AppIcon name="Clock" size={14} strokeWidth={2} />
              <span>Checked: {new Date().toLocaleString()}</span>
            </div>
          </div>

          {/* Optional Try Again Button */}
          <button
            onClick={() => window.location.reload()}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
