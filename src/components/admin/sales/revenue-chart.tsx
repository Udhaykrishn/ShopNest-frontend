import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components for line chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface RevenueChartProps {
  revenueData: {
    total: number;
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
    custom: number;
  };
  filterType: string;
  startDate?: string;
  endDate?: string;
  orders?: { createdAt: string; total: number }[]; // Added to handle actual order data
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ revenueData, filterType, startDate, endDate, orders = [] }) => {
  // Helper function to generate date labels and data
  const getChartData = () => {
    let labels: string[] = [];
    let data: number[] = [];

    // Fallback date if startDate is undefined or invalid
    const fallbackDate = new Date('2025-06-01');
    const validStartDate = startDate && !isNaN(new Date(startDate).getTime()) 
      ? new Date(startDate) 
      : fallbackDate;

    if (filterType === 'daily' && startDate) {
      labels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
      data = Array(24).fill(revenueData.daily / 24);
    } else if (filterType === 'weekly') {
      const start = new Date('2025-06-01'); // Current week starts Sunday, June 1
      labels = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        return date.toISOString().split('T')[0];
      });
      data = Array(7).fill(revenueData.weekly / 7);
    } else if (filterType === 'monthly') {
      const start = validStartDate;
      const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
      labels = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(start);
        date.setDate(start.getDate() + i + 1);
        return date.toISOString().split('T')[0];
      });
      data = Array(daysInMonth).fill(revenueData.monthly / daysInMonth);
    } else if (filterType === 'yearly' && startDate) {
      labels = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ];
      data = Array(12).fill(revenueData.yearly / 12);
    } else if (filterType === 'custom' && startDate && endDate) {
      const start = validStartDate;
      const end = endDate && !isNaN(new Date(endDate).getTime()) 
        ? new Date(endDate) 
        : new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      // Generate labels for each day in the range
      labels = Array.from({ length: days }, (_, i) => {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        return date.toISOString().split('T')[0];
      });

      // Initialize data array with zeros
      data = Array(days).fill(0);

      // Map orders to their respective dates
      orders.forEach(order => {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
        const index = labels.indexOf(orderDate);
        if (index !== -1) {
          data[index] += order.total; // Add order revenue to the correct date
        }
      });
    } else {
      labels = ['Total', 'Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom'];
      data = [
        revenueData.total,
        revenueData.daily,
        revenueData.weekly,
        revenueData.monthly,
        revenueData.yearly,
        revenueData.custom,
      ];
    }

    return { labels, data };
  };

  const { labels, data } = getChartData();

  // Check for empty data in weekly, monthly, or custom filters
  const isEmpty = (filterType === 'weekly' && revenueData.weekly === 0) || 
                  (filterType === 'monthly' && revenueData.monthly === 0) ||
                  (filterType === 'custom' && orders.length === 0);

  if (isEmpty) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        No sales data for this {filterType}
      </div>
    );
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Revenue (INR)',
        data,
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue (INR)',
        },
      },
      x: {
        title: {
          display: true,
          text: filterType === 'daily' ? 'Time of Day' : 
                filterType === 'weekly' || filterType === 'monthly' || filterType === 'custom' ? 'Date' : 
                filterType === 'yearly' ? 'Month' : 'Filter Type',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="h-80">
      <Line data={chartData} options={options} />
    </div>
  );
};