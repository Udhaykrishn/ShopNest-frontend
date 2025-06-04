import { Link } from '@tanstack/react-router';
import { Home, Package, Users, Settings } from 'lucide-react';

interface SidebarItem {
    icon: React.ReactNode;
    label: string;
    href: string;
}

export function Sidebar() {
    const sidebarItems: SidebarItem[] = [
        { icon: <Home className="h-5 w-5" />, label: 'Dashboard', href: '/vendor' },
        { icon: <Package className="h-5 w-5" />, label: 'Products', href: '/vendor/products' },
        { icon: <Users className="h-5 w-5" />, label: 'Customers', href: '/vendor/customers' },
        { icon: <Settings className="h-5 w-5" />, label: 'Settings', href: '/vendor/settings' },
    ];

    return (
        <nav className="flex h-full flex-col space-y-1 p-4">
            {sidebarItems.map((item) => (
                <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm hover:bg-accent"
                >
                    {item.icon}
                    <span>{item.label}</span>
                </Link>
            ))}
        </nav>
    );
}