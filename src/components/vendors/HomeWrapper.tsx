// src/routes/_layout.tsx
import React, { useState } from 'react';
import { Outlet, useRouter } from '@tanstack/react-router';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Wallet,
    LogOut,
    MessageSquare,
    RotateCcw,
    BarChart3,
    Users,
    Settings,
    Bell
} from 'lucide-react';
import { cn } from "@/lib/utils";

const sidebarItems = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
        id: 'analytics',
        label: 'Analytics',
        path: '/dashboard/analytics',
        icon: <BarChart3 className="w-5 h-5" />
    },
    {
        id: 'products',
        label: 'Products',
        path: '/dashboard/products',
        icon: <Package className="w-5 h-5" />
    },
    {
        id: 'orders',
        label: 'Orders',
        path: '/dashboard/orders',
        icon: <ShoppingCart className="w-5 h-5" />
    },
    {
        id: 'returns',
        label: 'Returns',
        path: '/dashboard/returns',
        icon: <RotateCcw className="w-5 h-5" />
    },
    {
        id: 'customers',
        label: 'Customers',
        path: '/dashboard/customers',
        icon: <Users className="w-5 h-5" />
    },
    {
        id: 'wallet',
        label: 'Wallet',
        path: '/dashboard/wallet',
        icon: <Wallet className="w-5 h-5" />
    },
    {
        id: 'chat',
        label: 'Messages',
        path: '/dashboard/chat',
        icon: <MessageSquare className="w-5 h-5" />
    }
];



export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState('dashboard');

    // Get current path and update active section
    const currentPath = router.state.location.pathname;
    const currentSection = currentPath.split('/').pop() || 'dashboard';

    const handleNavigation = (path: string, id: string) => {
        setActiveSection(id);
        router.navigate({ to: path });
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200">
                <div className="p-6">
                    <h1 className="text-xl font-semibold text-gray-800">Vendor Portal</h1>
                </div>
                <nav className="space-y-1 px-3">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.path, item.id)}
                            className={cn(
                                "flex items-center w-full px-4 py-3 text-sm rounded-lg transition-colors",
                                "hover:bg-gray-100 hover:text-gray-900",
                                activeSection === item.id
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-700"
                            )}
                        >
                            {item.icon}
                            <span className="ml-3 font-medium">{item.label}</span>
                        </button>
                    ))}

                    <div className="pt-4 mt-4 border-t border-gray-200">
                        <button
                            onClick={() => handleNavigation('/dashboard/settings', 'settings')}
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                        >
                            <Settings className="w-5 h-5" />
                            <span className="ml-3 font-medium">Settings</span>
                        </button>
                        <button
                            onClick={() => handleNavigation('/auth/logout', 'logout')}
                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 rounded-lg hover:bg-red-50"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="ml-3 font-medium">Logout</span>
                        </button>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
                    <div className="flex items-center justify-between px-6 py-4">
                        <h2 className="text-xl font-semibold text-gray-800 capitalize">
                            {activeSection}
                        </h2>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                                <Bell className="w-5 h-5" />
                            </button>
                            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                <span className="text-sm font-medium">JD</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}