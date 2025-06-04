import React from 'react';
import {
    Link,
    Outlet,
} from '@tanstack/react-router';
import {
    Home,
    Tags,
    Users,
    Ticket,
    User2,
    LogOut,
    Bell,
    User,
    ChevronDown,
    Menu,
    User2Icon,
    Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { useVendorMutations } from '@/hooks';

type SidebarItem = {
    icon: React.ElementType;
    label: string;
    to: string;
};

const sidebarItems: SidebarItem[] = [
    { icon: Home, label: 'Dashboard', to: '/vendor' },
    { icon: Tags, label: 'Products', to: '/vendor/products' },
    { icon: Users, label: 'Orders', to: '/vendor/orders' },
    { icon: Ticket, label: 'Offers', to: '/vendor/offers' },
    { icon: Wallet, label: 'Wallet', to: '/vendor/wallet' },
    { icon: User2Icon, label: "Profile", to: "/vendor/profile" }
];

export function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
    const { logoutVendor } = useVendorMutations({vendor:"another"})

    const handleLogout = async () => {
        await logoutVendor.mutateAsync()
        localStorage.removeItem("productFormData")
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-4 flex items-center space-x-2 border-b">
                <div className="w-8 h-8 bg-green-500 rounded-full flex justify-center
                items-center"><User2Icon /></div>
                <h1 className="text-xl font-bold">Vendor</h1>
            </div>

            <nav className="p-4 flex-grow">
                <div>
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.to}
                            className="flex items-center p-2 hover:bg-accent rounded cursor-pointer group mb-1"
                        >
                            <item.icon
                                className="mr-3 text-green-500 group-hover:text-green-400"
                                size={20}
                            />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            <div className="mt-auto p-4 border-t">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center p-2 hover:bg-accent rounded cursor-pointer">
                            <User className="mr-3 text-green-500" size={20} />
                            <span>Vendor Profile</span>
                            <ChevronDown className="ml-auto h-4 w-4" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>My Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <User2 className="mr-2 h-4 w-4" />
                            <span>Account Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span onClick={handleLogout}>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Mobile sidebar */}
            <Sheet>
                <SheetTrigger asChild className="md:hidden fixed top-4 left-4 z-40">
                    <Button variant="outline" size="icon">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0 border-r">
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            {/* Desktop sidebar */}
            <div className="hidden md:block  w-64 min-h-screen border-r fixed left-0 top-0 h-full  flex-col">
                <SidebarContent />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 md:ml-64 w-full flex flex-col">
                {/* Top Navbar */}
                <header className="sticky top-0 z-30 bg-background border-b w-full">
                    <div className="flex h-16 items-center justify-between px-4 md:px-6">
                        <h2 className="text-xl font-semibold ml-8 md:ml-0">Dashboard</h2>
                        <div className="flex items-center space-x-4">
                            <ModeToggle />
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Bell className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Content Area - Fixed Positioning */}
                <main className="p-4 md:p-6 flex-grow">
                    <div className="max-w-full mx-auto w-full">
                        {children || <Outlet />}
                    </div>
                </main>
            </div>
        </div>
    );
}