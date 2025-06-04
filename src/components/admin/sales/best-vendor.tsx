import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { HighestPaidVendor } from '@/types';
import { formatINR } from '@/utils';

interface BestVendorsProps {
    vendors: HighestPaidVendor[];
}

export const BestVendors: React.FC<BestVendorsProps> = ({ vendors }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Highest Paid Vendors</CardTitle>
            </CardHeader>
            <CardContent>
                {vendors.length === 0 ? (
                    <div className="flex justify-center items-center h-32 text-gray-500 text-lg">
                        No sellers available
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                        <table className="w-full text-left text-gray-900">
                            <thead className="bg-gray-100 text-sm font-semibold uppercase">
                                <tr>
                                    <th className="p-4">Vendor Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4 text-right">Payout</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendors.map((vendor, index) => (
                                    <tr
                                        key={index}
                                        className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                        }`}
                                    >
                                        <td className="p-4 font-medium">{vendor.vendor_name}</td>
                                        <td className="p-4">{vendor.vendor_email}</td>
                                        <td className="p-4 text-right">{formatINR(vendor.payout)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};