import * as XLSX from 'xlsx';
import { formatINR } from '@/utils';
import { BackendData } from '@/types';

interface DownloadExcelProps {
    backendData: BackendData;
    filterType: string;
    startDate: string;
    endDate: string;
    filteredSales: { sum: number; count: number };
    filteredOrderCount: { _id: string; count: number }[];
    totalDiscount: number;
}

const PRIMARY_COLOR = '#16a34a';
const BLACK_COLOR = '#000000';

export const DownloadExcel: React.FC<DownloadExcelProps> = ({
    backendData,
    filterType,
    startDate,
    endDate,
}) => {
    const customFormatINR = (value: number): string => {
        try {
            const formatted = formatINR(value).replace(/₹/g, '').trim();
            return `Rs. ${formatted}`;
        } catch (error) {
            console.error('Error formatting currency:', error);
            return `Rs. ${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    };

    const formatDate = (isoDate: string): string => {
        try {
            return new Date(isoDate).toISOString().split('T')[0];
        } catch (error) {
            console.error('Error formatting date:', error);
            return isoDate;
        }
    };

    const downloadExcel = () => {
        const wb = XLSX.utils.book_new();

        // Get date text based on filterType
        const currentDate = new Date().toISOString().split('T')[0];
        let dateText = '';
        if (filterType === 'custom' && startDate && endDate) {
            dateText = `Date Range: ${startDate} to ${endDate}`;
        } else if (filterType === 'daily') {
            dateText = `Date: ${currentDate}`;
        } else if (filterType === 'weekly') {
            dateText = `Week Ending: ${currentDate}`;
        } else if (filterType === 'monthly') {
            dateText = `Month: ${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
        } else if (filterType === 'yearly') {
            dateText = `Year: ${new Date().getFullYear()}`;
        } else {
            dateText = 'All Time';
        }

        // Calculate summary metrics
        const totalPrice = backendData.topProducts.reduce((sum, product) => sum + product.price, 0);
        const totalRevenue = totalPrice * 0.1; // 10% of total price
        const totalQuantity = backendData.topProducts.reduce((sum, product) => sum + product.quantity, 0);
        const totalOrders = backendData.topProducts.length;

        // Ordered Products Table
        const orderedProductsData = [
            ['ShopNest Sales Report - Ordered Products'],
            [`Filter: ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`],
            [dateText],
            [],
            ['Order ID', 'Order Date', 'Product Name', 'Price', 'Quantity', 'Status'],
            ...backendData.topProducts.map((product) => [
                product.orderId.toString(),
                formatDate(product.orderedDate),
                product.productName,
                customFormatINR(product.price),
                product.quantity.toString(),
                product.status,
            ]),
            [], // Empty row before summary
            ['Summary'],
            ['Total Revenue', customFormatINR(totalRevenue)],
            ['Total Quantity', totalQuantity.toString()],
            ['Total Orders', totalOrders.toString()],
        ];

        const wsProducts = XLSX.utils.aoa_to_sheet(orderedProductsData);
        wsProducts['!cols'] = [
            { wch: 20 }, // Order ID
            { wch: 15 }, // Order Date
            { wch: 40 }, // Product Name
            { wch: 20 }, // Price
            { wch: 15 }, // Quantity
            { wch: 15 }, // Status
        ];

        // Apply border and alignment styling
        Object.keys(wsProducts).forEach((cell) => {
            const row = parseInt(cell.match(/\d+/)?.[0] || '0');
            const borderStyle = {
                top: { style: 'medium', color: { rgb: BLACK_COLOR.replace('#', '') } },
                bottom: { style: 'medium', color: { rgb: BLACK_COLOR.replace('#', '') } },
                left: { style: 'medium', color: { rgb: BLACK_COLOR.replace('#', '') } },
                right: { style: 'medium', color: { rgb: BLACK_COLOR.replace('#', '') } },
            };

            if (row === 1 || row === 2 || row === 3 || row === 5 || row === orderedProductsData.length - 3) {
                // Title, Filter, Date, Header, and Summary Title
                wsProducts[cell].s = {
                    font: { bold: true, color: { rgb: PRIMARY_COLOR.replace('#', '') } },
                    fill: { fgColor: { rgb: 'E6F3E6' } }, // Light green background
                    alignment: { horizontal: 'left', vertical: 'center' },
                    border: borderStyle,
                };
            } else if (row >= 6 && row < orderedProductsData.length - 3) {
                // Data rows
                wsProducts[cell].s = {
                    alignment: {
                        horizontal: cell.startsWith('A') || cell.startsWith('B') || cell.startsWith('C') ? 'left' : 'right',
                        vertical: 'center',
                    },
                    border: borderStyle,
                };
            } else if (row >= orderedProductsData.length - 2) {
                // Summary rows
                wsProducts[cell].s = {
                    font: { bold: true },
                    alignment: {
                        horizontal: cell.startsWith('A') ? 'left' : 'right',
                        vertical: 'center',
                    },
                    border: borderStyle,
                };
            }
        });

        XLSX.utils.book_append_sheet(wb, wsProducts, 'Ordered Products');

        XLSX.writeFile(wb, `ShopNest_Sales_Report_${filterType}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <button
            onClick={downloadExcel}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
            Download Excel
        </button>
    );
};