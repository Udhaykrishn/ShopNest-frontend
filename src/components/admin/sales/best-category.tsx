import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { formatINR } from '@/utils';
import { BestSellCategory } from '@/types';

interface BestCategoriesProps {
  categories: BestSellCategory[];
}

const COLORS = ['#10b981', '#3b82f6', '#f97316', '#8b5cf6'];

export const BestCategories: React.FC<BestCategoriesProps> = ({ categories }) => {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const categoryData = categories.map((category) => ({
    name: category.category,
    value: category.totalSold,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Best Selling Categories
          {categories.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllCategories(!showAllCategories)}
            >
              {showAllCategories ? 'Show Chart' : 'View All Categories'}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-gray-500 text-lg">
            No categories available
          </div>
        ) : showAllCategories ? (
          <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 max-h-[300px] overflow-y-auto">
            <table className="w-full text-left text-gray-900">
              <thead className="bg-gray-100 text-sm font-semibold uppercase sticky top-0">
                <tr>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">Total Revenue</th>
                  <th className="p-4 text-right">Total Sold</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="p-4 font-medium">{category.category}</td>
                    <td className="p-4 text-right">{formatINR(category.totalRevenue)}</td>
                    <td className="p-4 text-right">{category.totalSold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value} items sold`} />
              <Bar dataKey="value" fill="#10b981">
                {categoryData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};