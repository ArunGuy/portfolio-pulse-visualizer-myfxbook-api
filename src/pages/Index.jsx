import React from 'react';
import dogSuitImage from '../assets/images/dog-suit.png';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full max-w-4xl max-h-[calc(100vh-4rem)] relative">
          <img
            src={dogSuitImage}
            alt="Mascot"
            className="w-full h-full object-contain object-center opacity-50"
          />
        </div>
      </div>
      <div className="z-10 text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          mhagutsfund
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Your trusted partner in financial growth
        </p>
      </div>
    </div>
  );
};

export default Index;