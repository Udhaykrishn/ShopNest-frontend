import { jsPDF } from 'jspdf';
import autoTable, { HookData } from 'jspdf-autotable';
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

    const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        let yPosition = margin + 10; // Space above the main heading

        // Main Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(PRIMARY_COLOR);
        doc.text('ShopNest Sales Report', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15; // Space below the main heading

        // Filter and Date Info
        const filterText = `Filter: ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`;
        let dateText = '';
        if (filterType === 'custom' && startDate && endDate) {
            dateText = `Date Range: ${startDate} to ${endDate}`;
        } else {
            const currentDate = new Date().toISOString().split('T')[0];
            if (filterType === 'daily') dateText = `Date: ${currentDate}`;
            else if (filterType === 'weekly') dateText = `Week Ending: ${currentDate}`;
            else if (filterType === 'monthly') dateText = `Month: ${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
            else if (filterType === 'yearly') dateText = `Year: ${new Date().getFullYear()}`;
            else dateText = 'All Time';
        }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(BLACK_COLOR);
        doc.text(filterText, margin, yPosition);
        yPosition += 8;
        doc.text(dateText, margin, yPosition);
        yPosition += 15;

        // Ordered Products (Delivered Only)
        const deliveredProducts = backendData.topProducts.filter(product => product.status.toLowerCase() === 'delivered');
        const totalPrice = deliveredProducts.reduce((sum, product) => sum + product.price, 0);
        const totalRevenue = totalPrice * 0.1; // 10% of total price
        const totalQuantity = deliveredProducts.reduce((sum, product) => sum + product.quantity, 0);
        const totalOrders = deliveredProducts.length;

        autoTable(doc, {
            startY: yPosition,
            head: [['Order ID', 'Order Date', 'Product Name', 'Price', 'Quantity', 'Status']],
            body: deliveredProducts.map((product) => [
                product.orderId.toString(),
                formatDate(product.orderedDate),
                product.productName,
                customFormatINR(product.price),
                product.quantity.toString(),
                product.status,
            ]),
            theme: 'grid',
            headStyles: {
                fillColor: [255, 255, 255], // White background
                textColor: BLACK_COLOR,
                fontStyle: 'bold',
                cellPadding: 3,
                fontSize: 10,
                lineWidth: 0.5,
                lineColor: BLACK_COLOR,
            },
            styles: {
                textColor: BLACK_COLOR,
                cellPadding: 3,
                fontSize: 10,
                overflow: 'ellipsize', // Truncate long text
                lineWidth: 0.5,
                lineColor: BLACK_COLOR,
            },
            margin: { left: margin, right: margin },
            columnStyles: {
                0: { cellWidth: 40, halign: 'right' }, // Order ID
                1: { cellWidth: 25 }, // Order Date
                2: { cellWidth: 40 }, // Product Name
                3: { cellWidth: 25, halign: 'right' }, // Price
                4: { cellWidth: 15, halign: 'right' }, // Quantity
                5: { cellWidth: 25 }, // Status
            },
            didDrawPage: (data:HookData) => {
                yPosition = data.cursor?.y as number + 15;
            },
        });

        
        if (yPosition + 40 > pageHeight) { 
            doc.addPage();
            yPosition = margin;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(BLACK_COLOR);
        doc.text('Summary', margin, yPosition);
        yPosition += 8;
        doc.setFont('helvetica', 'normal');
        doc.text(`Total Revenue: ${customFormatINR(totalRevenue)}`, margin, yPosition);
        yPosition += 6;
        doc.text(`Total Quantity: ${totalQuantity}`, margin, yPosition);
        yPosition += 6;
        doc.text(`Total Orders: ${totalOrders}`, margin, yPosition);
        yPosition += 15;

        // Footer
        const currentDateTime = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);
        doc.setTextColor(BLACK_COLOR);
        doc.text(`Generated by ShopNest on ${currentDateTime}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

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