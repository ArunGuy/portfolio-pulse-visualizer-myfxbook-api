import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CompoundInterestCalculator from '../components/CompoundInterestCalculator';

const CompoundInterestCalculatorPage = () => {
  return (
    <div className="container mx-auto p-4 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Compound Interest Calculator</h1>
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Calculate Your Investment Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <CompoundInterestCalculator />
        </CardContent>
      </Card>
    </div>
  );
};

export default CompoundInterestCalculatorPage;