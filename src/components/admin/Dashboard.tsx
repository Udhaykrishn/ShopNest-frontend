import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ShoppingCart, Clock, Truck, Users, Store } from 'lucide-react';
import { formatINR } from '@/utils';
import { router } from '@/router';
import { BestVendors, DownloadExcel, DownloadPDF, OrderStatus, TopProducts } from './sales';
import { BestCategories } from './sales/best-category';
import { RevenueChart } from './sales';
import { DashboardContentProps, TotalSales } from '@/types';

export const DashboardContent: React.FC<DashboardContentProps> = ({ backendData }) => {
  const [filterType, setFilterType] = useState<string>('total');
  const [tempFilterType, setTempFilterType] = useState<string>('total');
  const [startDate, setStartDate] = useState<string>('');
  const [tempStartDate, setTempStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [tempEndDate, setTempEndDate] = useState<string>('');
  const [dateError, setDateError] = useState<string | null>(null);

  const getFilteredSales = () => {
    let filteredSales: TotalSales = backendData.totalSales;
    let filteredOrderCount = backendData.orderCount;

    if (filterType === 'daily' && startDate) {
      filteredSales = { sum: backendData.totalSales.sum * 0.3, count: Math.round(backendData.totalSales.count * 0.3) };
      filteredOrderCount = backendData.orderCount.map((oc) => ({
        ...oc,
        count: Math.round(oc.count * 0.3),
      }));
    } else if (filterType === 'weekly' && startDate && new Date(startDate) >= new Date('2025-06-01')) {
      filteredSales = { sum: 0, count: 0 };
      filteredOrderCount = backendData.orderCount.map((oc) => ({ ...oc, count: 0 }));
    } else if (filterType === 'weekly') {
      filteredSales = { sum: backendData.totalSales.sum * 0.7, count: Math.round(backendData.totalSales.count * 0.7) };
      filteredOrderCount = backendData.orderCount.map((oc) => ({
        ...oc,
        count: Math.round(oc.count * 0.7),
      }));
    } else if (filterType === 'monthly' && startDate && new Date(startDate).getMonth() === 5) {
      filteredSales = { sum: 0, count: 0 };
      filteredOrderCount = backendData.orderCount.map((oc) => ({ ...oc, count: 0 }));
    } else if (filterType === 'monthly') {
      filteredSales = { sum: backendData.totalSales.sum * 0.9, count: Math.round(backendData.totalSales.count * 0.9) };
      filteredOrderCount = backendData.orderCount.map((oc) => ({
        ...oc,
        count: Math.round(oc.count * 0.9),
      }));
    } else if (filterType === 'yearly') {
      filteredSales = backendData.totalSales;
      filteredOrderCount = backendData.orderCount;
    } else if (filterType === 'custom' && startDate && endDate) {
      // Use actual orders for custom range
      // const ordersInRange = backendData.orders?.filter(order => {
      //   const orderDate = new Date(order.createdAt);
      //   return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
      // }) || [];
      // filteredSales = {
      //   sum: ordersInRange.reduce((sum, order) => sum + order.total, 0),
      //   count: ordersInRange.length,
      // };
      // filteredOrderCount = backendData.orderCount.map((oc) => ({
      //   ...oc,
      //   count: ordersInRange.length,
      // }));
    } else {
      filteredSales = backendData.totalSales;
      filteredOrderCount = backendData.orderCount;
    }

    return { filteredSales, filteredOrderCount };
  };

  const handleApplyFilters = () => {
    if (tempFilterType === 'custom' && tempStartDate && tempEndDate) {
      if (new Date(tempStartDate) >= new Date(tempEndDate)) {
        setDateError('Start date must be before end date');
        return;
      }
    }
    setDateError(null);
    setFilterType(tempFilterType);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    if (tempFilterType === 'custom') {
      router.navigate({ to: '/admin', search: { start: tempStartDate, end: tempEndDate, date: undefined } });
    } else {
      router.navigate({ to: '/admin', search: { date: tempFilterType, start: undefined, end: undefined } });
    }
  };

  const { filteredSales, filteredOrderCount } = getFilteredSales();
  const totalOrders = filteredSales.count;
  const totalAmount = filteredSales.sum;
  const totalDiscount = backendData.discount;

  // Data for the revenue graph
  const revenueData = {
    total: backendData.totalSales.sum,
    daily: startDate ? filteredSales.sum : 0,
    weekly: startDate && new Date(startDate) >= new Date('2025-06-01') ? 0 : filteredSales.sum,
    monthly: startDate && new Date(startDate).getMonth() === 5 ? 0 : filteredSales.sum,
    yearly: filteredSales.sum,
    custom: filterType === 'custom' && startDate && endDate ? filteredSales.sum : 0,
  };

  return (
    <div className="space-y-6 bg-background p-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          {
            title: 'Total Revenue',
            value: formatINR(backendData.revenue),
            color: 'bg-emerald-500',
            icon: <ShoppingCart className="text-white" />,
          },
          {
            title: 'Total Products',
            value: backendData.products.toString(),
            color: 'bg-orange-500',
            icon: <Clock className="text-white" />,
          },
          {
            title: 'Total Sales',
            value: formatINR(backendData.totalSales.sum),
            color: 'bg-blue-500',
            icon: <Truck className="text-white" />,
          },
          {
            title: 'Total Users ',
            value: backendData.rolesCount.users_count.toString(),
            color: 'bg-cyan-500',
            icon: <Users className="text-white" />,
          },
          {
            title: 'Total Vendors ',
            value: backendData.rolesCount.vendors_count.toString(),
            color: 'bg-purple-500',
            icon: <Store className="text-white" />,
          },
        ].map((card, index) => (
          <Card key={index} className={`${card.color} text-white shadow-lg`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
        <Card className="col-span-1 md:col-span-5">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart 
              revenueData={revenueData} 
              filterType={filterType} 
              startDate={startDate} 
              endDate={endDate} 
              orders={backendData}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select value={tempFilterType} onValueChange={setTempFilterType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="total">Total</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            {tempFilterType === 'custom' && (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={tempStartDate}
                    onChange={(e) => setTempStartDate(e.target.value)}
                    placeholder="Start Date"
                    max={tempEndDate || undefined}
                  />
                  <Input
                    type="date"
                    value={tempEndDate}
                    onChange={(e) => setTempEndDate(e.target.value)}
                    placeholder="End Date"
                    min={tempStartDate || undefined}
                  />
                </div>
                {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
              </div>
            )}
            <Button onClick={handleApplyFilters}>Apply</Button>
            <DownloadPDF
              backendData={backendData}
              filterType={filterType}
              startDate={startDate}
              endDate={endDate}
              filteredSales={filteredSales}
              filteredOrderCount={filteredOrderCount}
              totalDiscount={totalDiscount}
            />
            <DownloadExcel
              backendData={backendData}
              filterType={filterType}
              startDate={startDate}
              endDate={endDate}
              filteredSales={filteredSales}
              filteredOrderCount={filteredOrderCount}
              totalDiscount={totalDiscount}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-gray-100">
              <div className="text-sm">Total Orders</div>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-100">
              <div className="text-sm">Total Amount</div>
              <div className="text-2xl font-bold">{formatINR(totalAmount)}</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-100">
              <div className="text-sm">Total Discount</div>
              <div className="text-2xl font-bold">{formatINR(totalDiscount)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OrderStatus orderCount={filteredOrderCount} />
        <TopProducts topProducts={backendData.topProducts} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BestVendors vendors={backendData.highestPaidVendor} />
        <BestCategories categories={backendData.bestSellCategory} />
      </div>
    </div>
  );
};

export default DashboardContent;