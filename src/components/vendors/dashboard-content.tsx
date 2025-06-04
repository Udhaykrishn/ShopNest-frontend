import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {

    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    ShoppingCart,
    Clock,
    Truck,
    CheckCircle
} from 'lucide-react';

const productData = [
    { name: 'Green Leaf Lettuce', value: 400 },
    { name: 'Rainbow Chard', value: 300 },
    { name: 'Clementine', value: 300 },
    { name: 'Mint', value: 200 }
];

const COLORS = ['#10b981', '#3b82f6', '#f97316', '#8b5cf6'];

export function DashboardContent() {
    return (
        <div className="space-y-6 bg-background p-6">
            <div className="grid grid-cols-5 gap-4">
                {[
                    {
                        title: 'Today Orders',
                        value: '$897.40',
                        color: 'bg-emerald-500',
                        icon: <ShoppingCart className="text-white" />
                    },
                    {
                        title: 'Yesterday Orders',
                        value: '$679.93',
                        color: 'bg-orange-500',
                        icon: <Clock className="text-white" />
                    },
                    {
                        title: 'This Month',
                        value: '$13146.96',
                        color: 'bg-blue-500',
                        icon: <Truck className="text-white" />
                    },
                    {
                        title: 'Last Month',
                        value: '$31964.92',
                        color: 'bg-cyan-500',
                        icon: <Clock className="text-white" />
                    },
                    {
                        title: 'All-Time Sales',
                        value: '$626513.05',
                        color: 'bg-emerald-500',
                        icon: <CheckCircle className="text-white" />
                    }
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
            </div>

            <div className="grid grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Status</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        {[
                            { title: 'Total Orders', value: '815', color: 'bg-orange-500' },
                            { title: 'Orders Pending', value: '263', color: 'bg-cyan-500' },
                            { title: 'Orders Processing', value: '97', color: 'bg-blue-500' },
                            { title: 'Orders Delivered', value: '418', color: 'bg-emerald-500' }
                        ].map((stat, index) => (
                            <div key={index} className={`p-4 rounded-lg text-white ${stat.color}`}>
                                <div className="text-sm">{stat.title}</div>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Best Selling Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={productData}
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {productData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}