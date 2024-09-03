import React from 'react';
import dogSuitImage from '../assets/images/dog-suit.png';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-blue-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-white flex items-center justify-center">
        <div className="w-full h-full max-w-4xl max-h-[calc(100vh-4rem)] relative">
          <img
            src={dogSuitImage}
            alt="Mascot"
            className="w-full h-full object-contain object-center"
          />
        </div>
      </div>
      <div className="z-10 text-center bg-gray-900 bg-opacity-80 p-4 rounded-lg shadow-lg">
        <h1 className="text-6xl font-bold text-white mb-4">
          mhagutsfund
        </h1>
        <p className="text-xl text-gray-300">
          Your trusted partner in financial growth
        </p>
        <button className="mt-6 px-6 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Index;
