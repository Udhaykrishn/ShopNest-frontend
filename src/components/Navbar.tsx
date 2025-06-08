import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "./ui/button";
import { Menu, ShoppingCart, User, LogOut, Settings } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { LogoIcon } from "./Icons";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/user/userAuthStore";
import { useCartStore } from "@/stores/cart/useCartStore"
import { useUserMutation } from "@/hooks/user/useUserProfile";

interface RouteProps {
  href: string;
  label: string;
}

const baseRoutes: RouteProps[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/shop",
    label: "Shop",
  },
];

const authRoutes: RouteProps[] = [
  {
    href: "/login",
    label: "Login",
  },
  {
    href: "/signup",
    label: "Signup",
  },
];



export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isAuthenticated, logout } = useAuthStore()
  const { cartLength } = useCartStore()

  // Combine routes based on authentication status
  const routeList = isAuthenticated ? baseRoutes : [...baseRoutes, ...authRoutes];

  const {logout:userLogout} = useUserMutation()


  const handleLogout = async ()=>{
      await userLogout.mutateAsync()      
  }

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between">
          <NavigationMenuItem className="font-bold flex">
            <Link
              to="/"
              className="ml-2 font-bold text-xl flex items-center"
            >
              <LogoIcon />
              ShopNest
            </Link>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartLength > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-2">
                    {cartLength}
                  </Badge>
                )}
              </Link>
            )}
            <ModeToggle />

            <Sheet
              open={isOpen}
              onOpenChange={setIsOpen}
            >
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    ShopNest Menu
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {/* Always show base routes */}
                  {baseRoutes.map(({ href, label }: RouteProps) => (
                    <Link
                      to={href}
                      onClick={() => setIsOpen(false)}
                      key={label}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </Link>
                  ))}

                  {/* Show these items only when authenticated */}
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile/user"
                        onClick={() => setIsOpen(false)}
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/"
                        onClick={() => {
                          logout()
                          setIsOpen(false)
                        }}
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        Logout
                      </Link>
                    </>
                  ) : (
                    // Show auth routes when not authenticated
                    authRoutes.map(({ href, label }: RouteProps) => (
                      <Link
                        to={href}
                        onClick={() => setIsOpen(false)}
                        key={label}
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        {label}
                      </Link>
                    ))
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps, i) => (
              <Link
                rel="noreferrer noopener"
                to={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartLength > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center bg-primary text-white  justify-center p-2">
                      {cartLength}
                    </Badge>
                  )}
                </Link>
                <ModeToggle />

                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <User className="h-5 w-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link to="/profile/user" className="flex hover:text-primary items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/" className="flex hover:text-primary items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem >
                      <Link to="/" onClick={handleLogout} className="flex hover:text-red-600 items-center " >
                        <LogOut className="mr-2 h-4 w-4 hover:bg-primary" />
                        Logout
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <ModeToggle />
            )}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};