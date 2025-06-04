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

        // Top Products Table (with additional fields)
        const topProductsData = [
            ['ShopNest Sales Report - Top Products'],
            [`Filter: ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`],
            [dateText],
            [],
            ['Product', 'Price', 'Quantity', 'Delivery Status', 'Total Sold'],
            ...backendData.topProducts.map((product) => [
                product.productName,
                customFormatINR(product.price),
                product.quantity.toString(),
                product.status,
                product.total.toString(),
            ]),
        ];

        const wsProducts = XLSX.utils.aoa_to_sheet(topProductsData);
        wsProducts['!cols'] = [
            { wch: 40 }, // Product
            { wch: 20 }, // Price
            { wch: 15 }, // Quantity
            { wch: 20 }, // Delivery Status
            { wch: 20 }, // Total Sold
        ];

        Object.keys(wsProducts).forEach((cell) => {
            const row = parseInt(cell.match(/\d+/)?.[0] || '0');
            if (row === 1 || row === 2 || row === 3 || row === 5) {
                // Title, Filter, Date, and Header
                wsProducts[cell].s = {
                    font: { bold: true, color: { rgb: PRIMARY_COLOR.replace('#', '') } },
                    fill: { fgColor: { rgb: 'E6F3E6' } }, // Light green background
                    alignment: { horizontal: 'left' },
                    border: {
                        top: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                        bottom: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                        left: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                        right: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                    },
                };
            } else if (row >= 6) {
                // Data rows
                wsProducts[cell].s = {
                    alignment: { horizontal: cell.startsWith('A') || cell.startsWith('D') ? 'left' : 'right' },
                    border: {
                        top: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                        bottom: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                        left: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                        right: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                    },
                };
            }
        });
        XLSX.utils.book_append_sheet(wb, wsProducts, 'Top Products');

        // Best Selling Categories Table
        const categoriesData = [
            ['ShopNest Sales Report - Best Selling Categories'],
            [`Filter: ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`],
            [dateText],
            [],
            ['Category', 'Total Revenue', 'Total Sold'],
            ...backendData.bestSellCategory.map((category) => [
                category.category,
                customFormatINR(category.totalRevenue),
                category.totalSold.toString(),
            ]),
        ];

        const wsCategories = XLSX.utils.aoa_to_sheet(categoriesData);
        wsCategories['!cols'] = [
            { wch: 30 }, // Category
            { wch: 20 }, // Total Revenue
            { wch: 20 }, // Total Sold
        ];

        Object.keys(wsCategories).forEach((cell) => {
            const row = parseInt(cell.match(/\d+/)?.[0] || '0');
            if (row === 1 || row === 2 || row === 3 || row === 5) {
                // Title, Filter, Date, and Header
                wsCategories[cell].s = {
                    font: { bold: true, color: { rgb: PRIMARY_COLOR.replace('#', '') } },
                    fill: { fgColor: { rgb: 'E6F3E6' } }, // Light green background
                    alignment: { horizontal: cell.startsWith('B') || cell.startsWith('C') ? 'right' : 'left' },
                    border: {
                        top: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                        bottom: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                        left: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                        right: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                    },
                };
            } else if (row >= 6) {
                // Data rows
                wsCategories[cell].s = {
                    alignment: { horizontal: cell.startsWith('A') ? 'left' : 'right' },
                    border: {
                        top: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                        bottom: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                        left: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                        right: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                    },
                };
            }
        });
        XLSX.utils.book_append_sheet(wb, wsCategories, 'Best Selling Categories');

        // Highest Paid Vendors Table
        const vendorData = [
            ['ShopNest Sales Report - Highest Paid Vendors'],
            [`Filter: ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`],
            [dateText],
            [],
            ['Vendor Name', 'Email', 'Payout'],
            ...backendData.highestPaidVendor.map((vendor) => [
                vendor.vendor_name,
                vendor.vendor_email,
                customFormatINR(vendor.payout),
            ]),
        ];

        const wsVendors = XLSX.utils.aoa_to_sheet(vendorData);
        wsVendors['!cols'] = [
            { wch: 30 }, // Vendor Name
            { wch: 40 }, // Email
            { wch: 20 }, // Payout
        ];

        Object.keys(wsVendors).forEach((cell) => {
            const row = parseInt(cell.match(/\d+/)?.[0] || '0');
            if (row === 1 || row === 2 || row === 3 || row === 5) {
                // Title, Filter, Date, and Header
                wsVendors[cell].s = {
                    font: { bold: true, color: { rgb: PRIMARY_COLOR.replace('#', '') } },
                    fill: { fgColor: { rgb: 'E6F3E6' } }, // Light green background
                    alignment: { horizontal: cell.startsWith('C') ? 'right' : 'left' },
                    border: {
                        top: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                        bottom: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                        left: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                        right: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                    },
                };
            } else if (row >= 6) {
                // Data rows
                wsVendors[cell].s = {
                    alignment: { horizontal: cell.startsWith('C') ? 'right' : 'left' },
                    border: {
                        top: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                        bottom: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                        left: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                        right: { style: 'thin', color: { rgb: BLACK_COLOR.replace('#', '') } },
                    },
                };
            }
        });
        XLSX.utils.book_append_sheet(wb, wsVendors, 'Highest Paid Vendors');

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