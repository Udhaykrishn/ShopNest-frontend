import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatINR } from '@/utils';
import { BackendData } from '@/types';

declare module 'jspdf' {
    interface jsPDF {
        autoTable: typeof autoTable;
        previousAutoTable: { finalY: number };
    }
}

interface DownloadPDFProps {
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

export const DownloadPDF: React.FC<DownloadPDFProps> = ({
    backendData,
    filterType,
    startDate,
    endDate,
    filteredSales,
    filteredOrderCount,
    totalDiscount,
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

    const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let yPosition = margin + 10; // Space above the main heading

        // Main Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(PRIMARY_COLOR);
        doc.text('ShopNest Sales Report', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 25; // Space below the main heading

        // Date Info
        const dateInfo: [string, string][] = [];
        const filterText = `Filter: ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`;
        dateInfo.push(['Filter Type', filterText]);

        if (filterType === 'custom' && startDate && endDate) {
            dateInfo.push(['Date Range', `${startDate} to ${endDate}`]);
        } else {
            const currentDate = new Date().toISOString().split('T')[0];
            let dateText = '';
            if (filterType === 'daily') dateText = `Date: ${currentDate}`;
            else if (filterType === 'weekly') dateText = `Week Ending: ${currentDate}`;
            else if (filterType === 'monthly') dateText = `Month: ${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
            else if (filterType === 'yearly') dateText = `Year: ${new Date().getFullYear()}`;
            else dateText = 'All Time';
            dateInfo.push(['Period', dateText]);
        }

        autoTable(doc, {
            startY: yPosition,
            head: [['Field', 'Value']],
            body: dateInfo,
            theme: 'grid',
            headStyles: { fillColor: PRIMARY_COLOR, textColor: '#ffffff', cellPadding: 3 },
            styles: { textColor: BLACK_COLOR, cellPadding: 3, fontSize: 10, overflow: 'linebreak' },
            margin: { left: margin, right: margin },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 110 },
            },
        });
        yPosition = doc.previousAutoTable?.finalY ? doc.previousAutoTable.finalY + 20 : yPosition + 30;

        // Summary
        const currentDateTime = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
        const summaryData: [string, string][] = [
            ['Invoice Downloaded', currentDateTime],
            ['Total Revenue', customFormatINR(backendData.revenue)],
            ['Total Products', backendData.products.toString()],
            ['Total Sales', customFormatINR(filteredSales.sum)],
            ['Total Orders', filteredSales.count.toString()],
            ['Total Discount', customFormatINR(totalDiscount)],
            ['Total Users', backendData.rolesCount.users_count.toString()],
            ['Total Vendors', backendData.rolesCount.vendors_count.toString()],
        ];

        autoTable(doc, {
            startY: yPosition,
            head: [['Metric', 'Value']],
            body: summaryData,
            theme: 'grid',
            headStyles: { fillColor: PRIMARY_COLOR, textColor: '#ffffff', cellPadding: 3 },
            styles: { textColor: BLACK_COLOR, cellPadding: 3, fontSize: 10, overflow: 'linebreak' },
            margin: { left: margin, right: margin },
            columnStyles: {
                0: { cellWidth: 80 },
                1: { cellWidth: 80, halign: 'right' },
            },
        });
        yPosition = doc.previousAutoTable?.finalY ? doc.previousAutoTable.finalY + 20 : yPosition + 30;

        // Order Status
        const orderStatusData: [string, string][] = filteredOrderCount.map((stat) => [
            stat._id.charAt(0).toUpperCase() + stat._id.slice(1),
            stat.count.toString(),
        ]);

        autoTable(doc, {
            startY: yPosition,
            head: [['Status', 'Count']],
            body: orderStatusData,
            theme: 'grid',
            headStyles: { fillColor: PRIMARY_COLOR, textColor: '#ffffff', cellPadding: 3 },
            styles: { textColor: BLACK_COLOR, cellPadding: 3, fontSize: 10, overflow: 'linebreak' },
            margin: { left: margin, right: margin },
            columnStyles: {
                0: { cellWidth: 80 },
                1: { cellWidth: 80, halign: 'right' },
            },
        });
        yPosition = doc.previousAutoTable?.finalY ? doc.previousAutoTable.finalY + 20 : yPosition + 30;

        // Top Products
        autoTable(doc, {
            startY: yPosition,
            head: [['Product', 'Price', 'Quantity', 'Status', 'Total Sold']],
            body: backendData.topProducts.map((product) => [
                product.productName,
                customFormatINR(product.price),
                product.quantity.toString(),
                product.status,
                product.total.toString(),
            ]),
            theme: 'grid',
            headStyles: { fillColor: PRIMARY_COLOR, textColor: '#ffffff', cellPadding: 3 },
            styles: { textColor: BLACK_COLOR, cellPadding: 3, fontSize: 10, overflow: 'linebreak' },
            margin: { left: margin, right: margin },
            columnStyles: {
                0: { cellWidth: 60 },
                1: { cellWidth: 30, halign: 'right' },
                2: { cellWidth: 30, halign: 'right' },
                3: { cellWidth: 30 },
                4: { cellWidth: 30, halign: 'right' },
            },
        });
        yPosition = doc.previousAutoTable?.finalY ? doc.previousAutoTable.finalY + 20 : yPosition + 30;

        // Best Selling Categories
        autoTable(doc, {
            startY: yPosition,
            head: [['Category', 'Total Revenue', 'Total Sold']],
            body: backendData.bestSellCategory.map((category) => [
                category.category,
                customFormatINR(category.totalRevenue),
                category.totalSold.toString(),
            ]),
            theme: 'grid',
            headStyles: { fillColor: PRIMARY_COLOR, textColor: '#ffffff', cellPadding: 3 },
            styles: { textColor: BLACK_COLOR, cellPadding: 3, fontSize: 10, overflow: 'linebreak' },
            margin: { left: margin, right: margin },
            columnStyles: {
                0: { cellWidth: 60 },
                1: { cellWidth: 60, halign: 'right' },
                2: { cellWidth: 60, halign: 'right' },
            },
        });
        yPosition = doc.previousAutoTable?.finalY ? doc.previousAutoTable.finalY + 20 : yPosition + 30;

        // Highest Paid Vendors
        autoTable(doc, {
            startY: yPosition,
            head: [['Vendor Name', 'Email', 'Payout']],
            body: backendData.highestPaidVendor.map((vendor) => [
                vendor.vendor_name,
                vendor.vendor_email,
                customFormatINR(vendor.payout),
            ]),
            theme: 'grid',
            headStyles: { fillColor: PRIMARY_COLOR, textColor: '#ffffff', cellPadding: 3 },
            styles: { textColor: BLACK_COLOR, cellPadding: 3, fontSize: 10, overflow: 'linebreak' },
            margin: { left: margin, right: margin },
            columnStyles: {
                0: { cellWidth: 60 },
                1: { cellWidth: 80 },
                2: { cellWidth: 40, halign: 'right' },
            },
        });

        // Footer
        yPosition = doc.previousAutoTable?.finalY ? doc.previousAutoTable.finalY + 20 : yPosition + 30;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(BLACK_COLOR);
        doc.text(`Generated by ShopNest on ${currentDateTime}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

        doc.save(`ShopNest_Sales_Report_${filterType}_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
            Download PDF
        </button>
    );
};