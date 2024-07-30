import React from 'react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-5">Loading...</h3>
          <p className="text-sm text-gray-500 mt-2">Please wait while we process your request.</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;