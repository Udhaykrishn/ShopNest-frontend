import React from 'react';
import {
    Link,
    Outlet,
    useNavigate,
} from '@tanstack/react-router';
import {
    Home,
    Tags,
    Users,
    Ticket,
    LogOut,
    User,
    Heart,
    ChevronDown,
    Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type SidebarItem = {
    icon: React.ElementType;
    label: string;
    to: string;
};

const sidebarItems: SidebarItem[] = [
    { icon: Home, label: 'User', to: '/profile/user' },
    { icon: Tags, label: 'Orders', to: '/profile/orders' },
    { icon: Users, label: 'Wallet', to: '/profile/wallet' },
    { icon: Ticket, label: 'Address', to: '/profile/address' },
    { icon: Heart, label: 'Wishlist', to: '/profile/wishlist' }
];


export function UserDashboardLayout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border">
                <div className="w-8 h-8 bg-green-500 rounded-full" />
                <h1 className="text-xl font-bold text-foreground">User</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {sidebarItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.to}
                        className="flex items-center gap-3 p-2 hover:bg-accent rounded transition-colors"
                    >
                        <item.icon
                            className="text-green-500 group-hover:text-green-400"
                            size={20}
                        />
                        <span className="text-foreground">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Profile Dropdown */}
            <div className="p-4 border-t border-border">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-3 p-2 hover:bg-accent rounded cursor-pointer">
                            <User className="text-green-500" size={20} />
                            <span className="text-foreground">Profile</span>
                            <ChevronDown className="ml-auto h-4 w-4 text-foreground" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onClick={() => navigate({ to: "/login" })}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Mobile Sidebar */}
            <Sheet>
                <SheetTrigger asChild className="md:hidden fixed top-4 left-4 z-40">
                    <Button variant="outline" size="icon">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0 border-r border-border">
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 border-r border-border bg-background">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:ml-64">


                {/* Main Content Area */}
                <main className="flex-1 p-4 md:p-6">
                    <div className="max-w-7xl mx-auto w-full">
                        {/* Content aligned to start */}
                        <div className="mt-4">
                            {children || <Outlet />}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}