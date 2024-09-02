import React from 'react';
import dogIcon from '../assets/images/dog-icon.png';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          mhagutsfund
        </h1>
        <img
          src={dogIcon}
          alt="Mascot"
          className="w-64 h-64 object-contain mx-auto"
        />
        <p className="text-xl text-gray-600 dark:text-gray-400 mt-8">
          Your trusted partner in financial growth
        </p>
      </div>
    </div>
  );
};

export default Index;