"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogIn, LogOut, Menu, Search, ShoppingCart, User } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import SiteLogo from "./site-logo"
import { useSettings } from "@/contexts/settings-context"

export default function SiteHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { user, logOut } = useAuth()
  const { settings } = useSettings()
  const cartItemCount = 3 // This would be fetched from Firebase

  const handleSignOut = async () => {
    try {
      await logOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-100 bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-6">
                <SiteLogo size="lg" />
                <div className="grid gap-4">
                  <Link href="/" className="text-lg font-medium">
                    Home
                  </Link>
                  <Link href="/about" className="text-lg font-medium">
                    About
                  </Link>
                  <Link href="/devotionals" className="text-lg font-medium">
                    Devotionals
                  </Link>
                  <Link href="/events" className="text-lg font-medium">
                    Events
                  </Link>
                  <Link href="/shop" className="text-lg font-medium">
                    Shop
                  </Link>
                  <Link href="/prayer-requests" className="text-lg font-medium">
                    Prayer Requests
                  </Link>
                  <Link href="/contact" className="text-lg font-medium">
                    Contact
                  </Link>
                </div>
                <div className="mt-4">
                  {user ? (
                    <Button className="w-full" style={{ backgroundColor: settings.appearance.primaryColor }} asChild>
                      <Link href="/account">My Account</Link>
                    </Button>
                  ) : (
                    <div className="grid gap-2">
                      <Button className="w-full" style={{ backgroundColor: settings.appearance.primaryColor }} asChild>
                        <Link href="/login">Sign In</Link>
                      </Button>
                      <Button variant="outline" className="w-full border-amber-200" asChild>
                        <Link href="/register">Register</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <SiteLogo showText={true} />

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-amber-50 hover:text-primary focus:bg-amber-50 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-amber-50/50 data-[state=open]:bg-amber-50/50">
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-white hover:bg-amber-50 hover:text-primary data-[state=open]:bg-amber-50">
                  About
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/about"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-amber-50 hover:text-primary focus:bg-amber-50 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Our Story</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Learn about our history, mission, and values
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/about/leadership"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-amber-50 hover:text-primary focus:bg-amber-50 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Leadership</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Meet our pastoral team and staff
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/about/beliefs"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-amber-50 hover:text-primary focus:bg-amber-50 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Our Beliefs</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Explore our statement of faith and core beliefs
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/about/visit"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-amber-50 hover:text-primary focus:bg-amber-50 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Visit Us</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Service times, directions, and what to expect
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/devotionals" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-amber-50 hover:text-primary focus:bg-amber-50 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-amber-50/50 data-[state=open]:bg-amber-50/50">
                    Devotionals
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-white hover:bg-amber-50 hover:text-primary data-[state=open]:bg-amber-50">
                  Events
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/events"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-amber-50 hover:text-primary focus:bg-amber-50 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">All Events</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Browse all upcoming events and activities
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/events/retreats"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-amber-50 hover:text-primary focus:bg-amber-50 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Retreats</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Spiritual retreats and getaways
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/events/camps"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-amber-50 hover:text-primary focus:bg-amber-50 focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Camps</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Youth and family camps and activities
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/shop" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-amber-50 hover:text-primary focus:bg-amber-50 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-amber-50/50 data-[state=open]:bg-amber-50/50">
                    Shop
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/prayer-requests" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-amber-50 hover:text-primary focus:bg-amber-50 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-amber-50/50 data-[state=open]:bg-amber-50/50">
                    Prayer
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <div className={`relative transition-all duration-300 ${isSearchOpen ? "w-64" : "w-0"}`}>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full border-amber-200 focus-visible:ring-amber-400"
                  autoFocus
                />
              </motion.div>
            )}
          </div>

          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white">
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">Shopping cart</span>
            </Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/account">My Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/saved-devotionals">Saved Devotionals</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/event-registrations">Event Registrations</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/login">
                <LogIn className="h-5 w-5" />
                <span className="sr-only">Sign in</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

