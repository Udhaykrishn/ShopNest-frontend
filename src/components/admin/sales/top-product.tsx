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
import { TopProduct } from '@/types';

interface TopProductsProps {
  topProducts: TopProduct[];
}

const COLORS = ['#10b981', '#3b82f6', '#f97316', '#8b5cf6'];

export const TopProducts: React.FC<TopProductsProps> = ({ topProducts }) => {
  const [showAllProducts, setShowAllProducts] = useState(false);

  const productData = topProducts.map((product) => ({
    name: product.productName,
    value: product.total,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Top Products
          {topProducts.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllProducts(!showAllProducts)}
            >
              {showAllProducts ? 'Show Chart' : 'View All Products'}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topProducts.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-gray-500 text-lg">
            No products available
          </div>
        ) : showAllProducts ? (
          <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 max-h-[300px] overflow-y-auto">
            <table className="w-full text-left text-gray-900">
              <thead className="bg-gray-100 text-sm font-semibold uppercase sticky top-0">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Count</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="p-4">
                      <img
                        src={product.image}
                        alt={product.productName}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="p-4">{product.total}</td>
                    <td className="p-4 font-medium">{product.productName}</td>
                    <td className="p-4">{formatINR(product.price)}</td>
                    <td className="p-4">{product.quantity}</td>
                    <td className="p-4">{product.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value} orders`} />
              <Bar dataKey="value" fill="#10b981">
                {productData.map((_entry, index) => (
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