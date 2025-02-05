import React from 'react';
import {
    Link,
    Outlet,
} from '@tanstack/react-router';
import {
    Home,
    Package,
    Tags,
    Users,
    ShoppingCart,
    Ticket,
    Settings,
    LogOut,
    Bell,
    User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

// Define sidebar item type
type SidebarItem = {
    icon: React.ElementType;
    label: string;
    to: string;
};

// Sidebar items configuration
const sidebarItems: SidebarItem[] = [
    { icon: Home, label: 'Dashboard', to: '/vendor' },
    { icon: Package, label: 'Products', to: '/vendor/products' },
    { icon: Tags, label: 'Categories', to: '/vendor//categories' },
    { icon: Users, label: 'Customers', to: '/vendor//customers' },
    { icon: ShoppingCart, label: 'Orders', to: '/vendor//orders' },
    { icon: Ticket, label: 'Coupons', to: '/vendor//coupons' },
    { icon: Settings, label: 'Settings', to: '/vendor//settings' }
];

// Main Layout Component
export function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#121212] text-white">
            {/* Sidebar */}
            <div className="w-64 bg-[#1E1E1E] border-r border-[#2C2C2C]">
                <div className="p-4 flex items-center space-x-2 border-b border-[#2C2C2C]">
                    <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                    <h1 className="text-xl font-bold">Vendor</h1>
                </div>
                <nav className="p-4">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.to}
                            className="flex items-center p-2 hover:bg-[#2C2C2C] rounded cursor-pointer group"
                        >
                            <item.icon
                                className="mr-3 text-green-500 group-hover:text-white"
                                size={20}
                            />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                    <div
                        className="flex items-center p-2 hover:bg-[#2C2C2C] rounded cursor-pointer text-red-500 mt-4"
                    >
                        <LogOut className="mr-3" size={20} />
                        <span>Log out</span>
                    </div>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-[#121212]">
                {/* Top Navbar */}
                <header className="sticky top-0 z-40 bg-[#1E1E1E] border-b border-[#2C2C2C]">
                    <div className="flex h-16 items-center justify-between px-4">
                        <h2 className="text-xl font-semibold text-white">Dashboard</h2>
                        <div className="flex items-center space-x-4">
                            <Button className='bg-primary text-white'>
                                <ModeToggle />
                            </Button>
                            <Button className="text-white hover:bg-[#2C2C2C] p-2 rounded">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <button className="text-white hover:bg-[#2C2C2C] p-2 rounded-full">
                                <User className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="p-4">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
}
