import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import dogSuitImage from '../assets/images/dog-suit.png';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                mhagutsfund
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Your trusted partner in financial growth
              </p>
            </div>
            <img
              src={dogSuitImage}
              alt="Mascot"
              className="w-64 h-64 object-contain"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;