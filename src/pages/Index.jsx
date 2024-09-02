import React from 'react';
import dogSuitImage from '../assets/images/dog-suit.jpg';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 z-10">
        mhagutsfund
      </h1>
      <img
        src={dogSuitImage}
        alt="Mascot"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
    </div>
  );
};

export default Index;