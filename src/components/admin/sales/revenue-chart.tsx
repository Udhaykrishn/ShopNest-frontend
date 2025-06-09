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
import { BackendData } from '@/types';

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
  orders?: Pick<BackendData, 'topProducts'>;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ revenueData, filterType, startDate, endDate, orders = { topProducts: [] } }) => {
  const getChartData = () => {
    let labels: string[] = [];
    let data: number[] = [];

    const fallbackDate = new Date('2025-06-01');
    const validStartDate = startDate && !isNaN(new Date(startDate).getTime())
      ? new Date(startDate)
      : fallbackDate;

    if (filterType === 'daily' && startDate) {
      labels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
      data = Array(24).fill(revenueData.daily / 24);
    } else if (filterType === 'weekly' && startDate) {
      const start = validStartDate;
      labels = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        return date.toISOString().split('T')[0];
      });
      data = Array(7).fill(0);

      orders.topProducts.forEach(product => {
        const orderDate = new Date(product.orderedDate);
        const dateStr = orderDate.toISOString().split('T')[0];
        const index = labels.indexOf(dateStr);
        if (index !== -1) {
          data[index] += product.total;
        }
      });
    } else if (filterType === 'monthly' && startDate) {
      const start = validStartDate;
      const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
      labels = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(start);
        date.setDate(start.getDate() + i + 1);
        return date.toISOString().split('T')[0];
      });
      data = Array(daysInMonth).fill(0);

      orders.topProducts.forEach(product => {
        const orderDate = new Date(product.orderedDate);
        const dateStr = orderDate.toISOString().split('T')[0];
        const index = labels.indexOf(dateStr);
        if (index !== -1) {
          data[index] += product.total;
        }
      });
    } else if (filterType === 'yearly' && startDate) {
      labels = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ];
      data = Array(12).fill(0);

      orders.topProducts.forEach(product => {
        const orderDate = new Date(product.orderedDate);
        const month = orderDate.getMonth();
        data[month] += product.total;
      });
    } else if (filterType === 'custom' && startDate && endDate) {
      const start = validStartDate;
      const end = endDate && !isNaN(new Date(endDate).getTime())
        ? new Date(endDate)
        : new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      labels = Array.from({ length: days }, (_, i) => {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        return date.toISOString().split('T')[0];
      });
      data = Array(days).fill(0);

      orders.topProducts.forEach(product => {
        const orderDate = new Date(product.orderedDate);
        const dateStr = orderDate.toISOString().split('T')[0];
        const index = labels.indexOf(dateStr);
        if (index !== -1) {
          data[index] += product.total;
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

  const isEmpty = data.every(value => value === 0) || orders.topProducts.length === 0;

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