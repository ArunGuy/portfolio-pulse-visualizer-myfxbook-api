import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CompoundInterestCalculator from '../components/CompoundInterestCalculator';

const CompoundInterestCalculatorPage = () => {
  return (
    <div className="container mx-auto p-4 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-6">Compound Interest Calculator</h1>
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Calculate Your Investment Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <CompoundInterestCalculator />
        </CardContent>
      </Card>
    </div>
  );
};

export default CompoundInterestCalculatorPage;