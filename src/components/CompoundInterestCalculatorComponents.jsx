import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const InputField = ({ id, label, value, onChange }) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type="number"
      value={value}
      onChange={onChange}
      className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
    />
  </div>
);

export const ResultCard = ({ result }) => (
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
    </CardContent>
  </Card>
);

export const ChartComponent = ({ chartData }) => (
  <div className="mt-6">
    <h3 className="text-xl font-semibold mb-4">การเติบโตของเงินลงทุน</h3>
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
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
);

export const ResultTable = ({ monthlyBreakdown }) => (
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
      {monthlyBreakdown.map((row) => (
        <TableRow key={row.month}>
          <TableCell>{row.month}</TableCell>
          <TableCell>${row.balance}</TableCell>
          <TableCell>${row.interestEarned}</TableCell>
          <TableCell>${row.totalDeposits}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);