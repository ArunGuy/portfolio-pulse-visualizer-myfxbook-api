import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CompoundInterestCalculator = () => {
  const [startBalance, setStartBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [years, setYears] = useState('');
  const [months, setMonths] = useState('');
  const [compoundingFrequency, setCompoundingFrequency] = useState('Monthly');
  const [additionalContribution, setAdditionalContribution] = useState('');
  const [contributionFrequency, setContributionFrequency] = useState('monthly');
  const [result, setResult] = useState(null);

  const calculateCompoundInterest = () => {
    const principal = parseFloat(startBalance);
    const rate = parseFloat(interestRate) / 100;
    const totalMonths = parseInt(years) * 12 + parseInt(months);
    const periodsPerYear = compoundingFrequency === 'Monthly' ? 12 : 1;
    const additionalPerPeriod = parseFloat(additionalContribution) || 0;

    let balance = principal;
    let totalDeposits = principal;
    const monthlyBreakdown = [];

    for (let month = 1; month <= totalMonths; month++) {
      const interestEarned = balance * (rate / periodsPerYear);
      balance += interestEarned;

      if (contributionFrequency === 'monthly' || (contributionFrequency === 'yearly' && month % 12 === 0)) {
        balance += additionalPerPeriod;
        totalDeposits += additionalPerPeriod;
      }

      monthlyBreakdown.push({
        month,
        balance: balance.toFixed(2),
        interestEarned: interestEarned.toFixed(2),
        totalDeposits: totalDeposits.toFixed(2),
      });
    }

    const totalEarnings = balance - totalDeposits;
    const timeWeightedReturn = ((balance / totalDeposits) - 1) * 100;

    setResult({
      futureValue: balance.toFixed(2),
      totalEarnings: totalEarnings.toFixed(2),
      totalDeposits: totalDeposits.toFixed(2),
      timeWeightedReturn: timeWeightedReturn.toFixed(2),
      monthlyBreakdown,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startBalance">Start balance ($)</Label>
          <Input
            id="startBalance"
            type="number"
            value={startBalance}
            onChange={(e) => setStartBalance(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label htmlFor="interestRate">Interest rate (%)</Label>
          <Input
            id="interestRate"
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label htmlFor="years">Years</Label>
          <Input
            id="years"
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label htmlFor="months">Months</Label>
          <Input
            id="months"
            type="number"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label htmlFor="compoundingFrequency">Compounding</Label>
          <Select onValueChange={setCompoundingFrequency} defaultValue={compoundingFrequency}>
            <SelectTrigger className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Monthly">Monthly (12/yr)</SelectItem>
              <SelectItem value="Yearly">Yearly (1/yr)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="additionalContribution">Additional contributions ($)</Label>
          <Input
            id="additionalContribution"
            type="number"
            value={additionalContribution}
            onChange={(e) => setAdditionalContribution(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label htmlFor="contributionFrequency">Contribution frequency</Label>
          <Select onValueChange={setContributionFrequency} defaultValue={contributionFrequency}>
            <SelectTrigger className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={calculateCompoundInterest} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        Calculate
      </Button>
      {result && (
        <Card className="mt-6 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">Future Value</p>
                <p className="text-2xl font-bold text-green-600">${result.futureValue}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">Total Earnings</p>
                <p className="text-2xl font-bold text-blue-600">${result.totalEarnings}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">Total Deposits</p>
                <p className="text-2xl font-bold text-purple-600">${result.totalDeposits}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">Time-Weighted Return</p>
                <p className="text-2xl font-bold text-orange-600">{result.timeWeightedReturn}%</p>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Interest Earned</TableHead>
                  <TableHead>Total Deposits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.monthlyBreakdown.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell>{row.month}</TableCell>
                    <TableCell>${row.balance}</TableCell>
                    <TableCell>${row.interestEarned}</TableCell>
                    <TableCell>${row.totalDeposits}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompoundInterestCalculator;