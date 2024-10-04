import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
    const monthlyRate = parseFloat(interestRate) / 100 / 12; // Convert annual rate to monthly
    const totalMonths = parseInt(years) * 12 + parseInt(months);
    const additionalPerPeriod = parseFloat(additionalContribution) || 0;
    
    let balance = principal;
    let totalDeposits = principal;
    const monthlyBreakdown = [];
    
    for (let month = 1; month <= totalMonths; month++) {
      const interestEarned = balance * monthlyRate;
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
    
    const chartData = monthlyBreakdown.filter((_, index) => index % 12 === 0 || index === monthlyBreakdown.length - 1);
    
    setResult({
      futureValue: balance.toFixed(2),
      totalEarnings: totalEarnings.toFixed(2),
      totalDeposits: totalDeposits.toFixed(2),
      timeWeightedReturn: timeWeightedReturn.toFixed(2),
      monthlyBreakdown,
      chartData,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startBalance">ยอดเริ่มต้น ($)</Label>
          <Input
            id="startBalance"
            type="number"
            value={startBalance}
            onChange={(e) => setStartBalance(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label htmlFor="interestRate">อัตราดอกเบี้ย (%)</Label>
          <Input
            id="interestRate"
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label htmlFor="years">ปี</Label>
          <Input
            id="years"
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label htmlFor="months">เดือน</Label>
          <Input
            id="months"
            type="number"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label htmlFor="compoundingFrequency">การคำนวณดอกเบี้ย</Label>
          <Select onValueChange={setCompoundingFrequency} defaultValue={compoundingFrequency}>
            <SelectTrigger className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="เลือกความถี่" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Monthly">รายเดือน (12 ครั้ง/ปี)</SelectItem>
              <SelectItem value="Yearly">รายปี (1 ครั้ง/ปี)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="additionalContribution">การสมทบเพิ่มเติม ($)</Label>
          <Input
            id="additionalContribution"
            type="number"
            value={additionalContribution}
            onChange={(e) => setAdditionalContribution(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label htmlFor="contributionFrequency">ความถี่การสมทบ</Label>
          <Select onValueChange={setContributionFrequency} defaultValue={contributionFrequency}>
            <SelectTrigger className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="เลือกความถี่" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">รายเดือน</SelectItem>
              <SelectItem value="yearly">รายปี</SelectItem>
            </SelectContent>
          </Select>
        </div>

      <Button onClick={calculateCompoundInterest} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        คำนวณ
      </Button>

      {result && (
        <Card className="mt-6 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">ผลลัพธ์</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">มูลค่าในอนาคต</p>
                <p className="text-2xl font-bold text-green-600">${result.futureValue}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">รายได้รวม</p>
                <p className="text-2xl font-bold text-blue-600">${result.totalEarnings}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">ยอดฝากรวม</p>
                <p className="text-2xl font-bold text-purple-600">${result.totalDeposits}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">ผลตอบแทนตามเวลาที่คำนวณ</p>
                <p className="text-2xl font-bold text-orange-600">{result.timeWeightedReturn}%</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">การเติบโตของเงินลงทุน</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={result.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" label={{ value: 'เดือน', position: 'insideBottomRight', offset: -10 }} />
                  <YAxis label={{ value: 'จำนวนเงิน ($)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="balance" name="ยอดเงินรวม" stroke="#8884d8" />
                  <Line type="monotone" dataKey="totalDeposits" name="เงินฝากสะสม" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="interestEarned" name="ดอกเบี้ยสะสม" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>เดือน</TableHead>
                  <TableHead>ยอดเงิน</TableHead>
                  <TableHead>ดอกเบี้ยที่ได้รับ</TableHead>
                  <TableHead>ยอดฝากรวม</TableHead>
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
